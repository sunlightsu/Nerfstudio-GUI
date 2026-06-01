"""训练方法参数注册表 — 新增方法只需在此添加一个 dict，无需改任何代码。

每个条目格式: (CLI参数名, Pydantic字段名, 类型, 默认值, 仅用于方法列表)
  类型: str | int | float | bool | "choice"
  默认值: None 表示用户未填时不输出该参数
"""

# ── 公共参数（所有方法共享） ──
_COMMON = [
    ("data",                "data",                 str,    None),
    ("output-dir",          "output_dir",           str,    None),
    ("experiment-name",     "experiment_name",      str,    None),
    ("max-num-iterations",  "max_num_iterations",   int,    30000),
    ("vis",                 "vis",                  str,     "viewer"),
    ("mixed-precision",     "mixed_precision",      bool,    None),
    ("steps-per-save",      "steps_per_save",       int,     2000),
    ("background-color",    "background_color",     str,     None),
]

# ── 公共数据管理器参数 ──
_DATAMANAGER_COMMON = [
    ("cache-images-type",           "cache_images_type",        str,    None),
    ("camera-res-scale-factor",     "camera_res_scale_factor",  float,   None),
]

# ── 公共模型参数（所有方法可设） ──
_MODEL_COMMON = [
    ("camera-optimizer.mode",       "camera_optimizer_mode",    str,     None),
]

# ═══════════════════════════════════════════════════════════════
# 方法注册表 — 只列出每个方法独有的参数
# 公共参数（_COMMON + _DATAMANAGER_COMMON + _MODEL_COMMON）自动生效
# ═══════════════════════════════════════════════════════════════

METHODS: dict[str, dict] = {
    "nerfacto": {
        "label": "⭐ nerfacto (推荐·NeRF)",
        "datamanager": _DATAMANAGER_COMMON + [
            ("train-num-rays-per-batch",    "train_num_rays_per_batch",    int,    4096),
        ],
        "model": [
            ("num-nerf-samples-per-ray",    "num_nerf_samples_per_ray",    int,    48),
            ("num-proposal-samples-per-ray","num_proposal_samples_per_ray",str,    None),
            ("max-res",                     "max_res",                     int,    2048),
            ("log2-hashmap-size",           "log2_hashmap_size",           int,    19),
            ("num-levels",                  "num_levels",                  int,    16),
            ("hidden-dim",                  "hidden_dim",                  int,    64),
            ("hidden-dim-color",            "hidden_dim_color",            int,    64),
            ("near-plane",                  "near_plane",                  float,  0.05),
            ("far-plane",                   "far_plane",                   float,  1000.0),
        ],
    },

    "splatfacto": {
        "label": "⭐ splatfacto (3DGS·实时)",
        "datamanager": _DATAMANAGER_COMMON,
        "model": [
            ("sh-degree",                   "sh_degree",                   int,    3),
            ("cull-alpha-thresh",           "cull_alpha_thresh",           float,  0.1),
            ("densify-grad-thresh",         "densify_grad_thresh",         float,  0.0008),
            ("ssim-lambda",                 "ssim_lambda",                 float,  0.2),
            ("refine-every",                "refine_every",                int,    100),
            ("random-init",                 "random_init",                 bool,   False),
        ],
    },
}

# ═══════════════════════════════════════════════════════════════
# ns-process-data 参数注册表
# ═══════════════════════════════════════════════════════════════
PROCESS_COMMON = [
    ("camera-type",             "camera_type",          str,    "perspective"),
    ("matching-method",         "matching_method",      str,    "vocab_tree"),
    ("sfm-tool",                "sfm_tool",             str,    "any"),
    ("gpu",                     "gpu",                  bool,   True),
]
PROCESS_OPTIONAL = [
    ("num-downscales",          "num_downscales",       int,    None),
    ("max-dataset-size",        "max_dataset_size",     int,    None),
    ("crop-factor",             "crop_factor",          str,    None),
    ("crop-bottom",             "crop_bottom",          float,  None),
    ("feature-type",            "feature_type",         str,    None),
    ("matcher-type",            "matcher_type",         str,    None),
    ("refine-pixsfm",           "refine_pixsfm",        bool,   False),
    ("refine-intrinsics",       "refine_intrinsics",    bool,   True),
    ("use-sfm-depth",           "use_sfm_depth",        bool,   False),
    ("include-depth-debug",     "include_depth_debug",  bool,   False),
    ("same-dimensions",         "same_dimensions",      bool,   True),
    ("use-single-camera-mode",  "use_single_camera_mode", bool, True),
    ("percent-radius-crop",     "percent_radius_crop",  float,  None),
    ("verbose",                 "verbose",              bool,   False),
    ("skip-colmap",             "skip_colmap",          bool,   False),
    ("skip-image-processing",   "skip_image_processing",bool,   False),
    ("colmap-model-path",       "colmap_model_path",    str,    None),
    ("colmap-cmd",              "colmap_cmd",           str,    None),
    ("images-per-equirect",     "images_per_equirect",  int,    None),
    ("eval-data",               "eval_data",            str,    None),
    ("num-frames-per-second",   "num_frames_per_second",float,  None),
    ("start-frame",             "start_frame",          int,    None),
    ("end-frame",               "end_frame",            int,    None),
]

# ═══════════════════════════════════════════════════════════════
# ns-export 参数注册表
# ═══════════════════════════════════════════════════════════════
EXPORT_METHODS: dict[str, dict] = {
    "poisson": {
        "label": "⭐ poisson (泊松重建·推荐)",
        "params": [
            ("num-points",              "num_points",           int,    None),
            ("remove-outliers",         "remove_outliers",      bool,   None),
            ("reorient-normals",        "reorient_normals",     bool,   None),
            ("normal-method",           "normal_method",        str,    None),
            ("normal-output-name",      "normal_output_name",   str,    None),
            ("depth-output-name",       "depth_output_name",    str,    None),
            ("rgb-output-name",         "rgb_output_name",      str,    None),
            ("save-point-cloud",        "save_point_cloud",     bool,   None),
            ("obb-center",              "obb_center",           str,    None),
            ("obb-rotation",            "obb_rotation",         str,    None),
            ("obb-scale",               "obb_scale",            str,    None),
            ("num-rays-per-batch",      "num_rays_per_batch",   int,    None),
            ("texture-method",          "texture_method",       str,    None),
            ("px-per-uv-triangle",      "px_per_uv_triangle",   int,    None),
            ("unwrap-method",           "unwrap_method",        str,    None),
            ("num-pixels-per-side",     "num_pixels_per_side",  int,    None),
            ("target-num-faces",        "target_num_faces",     int,    None),
            ("std-ratio",               "std_ratio",            float,  None),
        ],
    },
    "pointcloud": {
        "label": "pointcloud (点云)",
        "params": [
            ("num-points",              "num_points",           int,    None),
            ("remove-outliers",         "remove_outliers",      bool,   None),
            ("reorient-normals",        "reorient_normals",     bool,   None),
            ("normal-method",           "normal_method",        str,    None),
            ("normal-output-name",      "normal_output_name",   str,    None),
            ("depth-output-name",       "depth_output_name",    str,    None),
            ("rgb-output-name",         "rgb_output_name",      str,    None),
            ("obb-center",              "obb_center",           str,    None),
            ("obb-rotation",            "obb_rotation",         str,    None),
            ("obb-scale",               "obb_scale",            str,    None),
            ("num-rays-per-batch",      "num_rays_per_batch",   int,    None),
            ("std-ratio",               "std_ratio",            float,  None),
            ("save-world-frame",        "save_world_frame",     bool,   None),
        ],
    },
    "tsdf": {
        "label": "tsdf (TSDF 融合)",
        "params": [
            ("downscale-factor",        "downscale_factor",     int,    None),
            ("resolution",              "resolution",           str,    None),
            ("batch-size",              "batch_size",           int,    None),
            ("bounding-box-min",        "bounding_box_min",     str,    None),
            ("bounding-box-max",        "bounding_box_max",     str,    None),
            ("texture-method",          "texture_method",       str,    None),
            ("target-num-faces",        "target_num_faces",     int,    None),
            ("num-pixels-per-side",     "num_pixels_per_side",  int,    None),
        ],
    },
    "gaussian-splat": {
        "label": "gaussian-splat (3DGS .ply)",
        "params": [
            ("output-filename",         "output_filename",      str,    None),
            ("ply-color-mode",          "ply_color_mode",       str,    None),
            ("obb-center",              "obb_center",           str,    None),
            ("obb-rotation",            "obb_rotation",         str,    None),
            ("obb-scale",               "obb_scale",            str,    None),
        ],
    },
    "marching-cubes": {
        "label": "marching-cubes (仅 SDF)",
        "params": [
            ("resolution",              "resolution",           str,    None),
            ("isosurface-threshold",    "isosurface_threshold", float,  None),
            ("simplify-mesh",           "simplify_mesh",        bool,   None),
            ("bounding-box-min",        "bounding_box_min",     str,    None),
            ("bounding-box-max",        "bounding_box_max",     str,    None),
            ("target-num-faces",        "target_num_faces",     int,    None),
            ("num-pixels-per-side",     "num_pixels_per_side",  int,    None),
        ],
    },
    "cameras": {
        "label": "cameras (相机位姿)",
        "params": [],
    },
}
