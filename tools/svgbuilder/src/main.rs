use serde::{Deserialize, Serialize};
use std::cell::Ref;
use std::collections::HashMap;
use std::env;
use std::fs;
use std::io;
use std::path::Path;
use std::str;
use svg_metadata::Metadata;
use svgbuilder;
use svgbuilder::options::{CleaningOptions, StyleJoinMode};
use svgdom::{Attributes, ParseOptions, WriteOptions};

#[derive(Serialize, Deserialize, Debug)]
struct IconMeta {
    name: String,
    height: u64,
    width: u64,
    attrs: HashMap<String, String>,
}

fn gen_cleaning_options() -> CleaningOptions {
    CleaningOptions {
        remove_unused_defs: true,
        convert_shapes: true,
        remove_title: true,
        remove_desc: true,
        remove_metadata: true,
        remove_dupl_linear_gradients: true,
        remove_dupl_radial_gradients: true,
        remove_dupl_fe_gaussian_blur: true,
        ungroup_groups: true,
        ungroup_defs: true,
        group_by_style: true,
        merge_gradients: true,
        regroup_gradient_stops: true,
        remove_invalid_stops: true,
        remove_invisible_elements: true,
        resolve_use: true,

        remove_version: true,
        remove_unreferenced_ids: true,
        trim_ids: true,
        remove_text_attributes: true,
        remove_unused_coordinates: true,
        remove_default_attributes: true,
        remove_xmlns_xlink_attribute: true,
        remove_needless_attributes: true,
        remove_gradient_attributes: false,
        join_style_attributes: StyleJoinMode::None,
        apply_transform_to_gradients: true,
        apply_transform_to_shapes: true,

        paths_to_relative: true,
        remove_unused_segments: true,
        append_newline: true,
        convert_segments: true,
        apply_transform_to_paths: false,

        coordinates_precision: 6,
        properties_precision: 6,
        paths_coordinates_precision: 8,
        transforms_precision: 8,
    }
}

fn gen_parse_options() -> ParseOptions {
    ParseOptions {
        parse_comments: false,
        parse_declarations: false,
        parse_unknown_elements: false,
        parse_unknown_attributes: false,
        parse_px_unit: false,
        skip_unresolved_classes: true,
        skip_invalid_attributes: false,
        skip_invalid_css: false,
        skip_paint_fallback: false,
    }
}

fn gen_write_options() -> WriteOptions {
    use svgdom::{AttributesOrder, Indent, ListSeparator};
    WriteOptions {
        indent: Indent::None,
        attributes_indent: Indent::None,
        use_single_quote: false,
        trim_hex_colors: false,
        write_hidden_attributes: false,
        remove_leading_zero: true,
        use_compact_path_notation: true,
        join_arc_to_flags: false,
        remove_duplicated_path_commands: true,
        use_implicit_lineto_commands: true,
        simplify_transform_matrices: true,
        list_separator: ListSeparator::Space,
        attributes_order: AttributesOrder::Alphabetical,
    }
}

fn get_attrs(attrs: Ref<Attributes>) -> HashMap<String, String> {
    let mut out = HashMap::new();
    for attr in attrs.iter() {
        out.insert(
            attr.id().unwrap().name().to_string(),
            attr.value.to_string(),
        );
    }
    out
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let directory = Path::new(&args[1]).canonicalize().unwrap();

    if !directory.is_dir() {
        return;
    }

    let pack_name = directory.file_name().unwrap().to_str().unwrap();
    println!("Building pack {}", pack_name);

    let mut icons: Vec<IconMeta> = Vec::new();

    let mut entries = fs::read_dir(&directory)
        .unwrap()
        .map(|res| res.map(|e| e.path()))
        .collect::<Result<Vec<_>, io::Error>>()
        .unwrap();
    entries.sort();

    for filename in entries {
        if !filename.to_str().unwrap().ends_with(".svg") {
            continue;
        }

        let icon_name = filename
            .with_extension("")
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string();

        let mut data = fs::read(&filename).expect("Error reading file");

        let parse_opt = gen_parse_options();
        let write_opt = gen_write_options();
        let cleaning_opt = gen_cleaning_options();

        let mut doc =
            svgbuilder::cleaner::parse_data(str::from_utf8(&data).unwrap(), &parse_opt).unwrap();

        svgbuilder::cleaner::clean_doc(&mut doc, &cleaning_opt, &write_opt).unwrap();

        data.clear();
        svgbuilder::cleaner::write_buffer(&doc, &write_opt, &mut data);
        if cleaning_opt.append_newline {
            data.push(b'\n');
        }
        fs::write(&filename, &data).unwrap();

        let meta = Metadata::parse(str::from_utf8(&data).unwrap()).unwrap();

        let icon_meta = IconMeta {
            name: icon_name,
            height: meta
                .height()
                .unwrap_or_else(|| meta.view_box.unwrap().height) as u64,
            width: meta.width().unwrap_or_else(|| meta.view_box.unwrap().width) as u64,
            attrs: get_attrs(doc.root.first_child().unwrap().attributes()),
        };

        fs::write(
            filename.with_extension("json"),
            serde_json::to_string(&icon_meta).unwrap(),
        )
        .unwrap();
        icons.push(icon_meta);
    }

    fs::write(
        directory.join("metadata.json"),
        serde_json::to_string(&icons).unwrap(),
    )
    .unwrap();
}
