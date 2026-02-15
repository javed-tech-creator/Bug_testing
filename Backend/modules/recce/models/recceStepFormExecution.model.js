import mongoose from "mongoose";

const { Schema } = mongoose;

/* =====================================
   COMMON FILE SCHEMA
===================================== */

const fileSchema = new Schema(
  {
    public_id: { type: String, default: "" },
    public_url: { type: String, default: "" },
    url: { type: String, default: "" },
    name: { type: String, default: "" },
    type: { type: String, default: "" },
  },
  { _id: false },
);

/* =====================================
   STEP 1
===================================== */

const step1Schema = new Schema(
  {
    environmental_conditions: {
      sunlight_exposure: { type: String, default: "" },
      rain_exposure: { type: String, default: "" },
      wind_exposure: { type: String, default: "" },
      ambient_light: { type: String, default: "" },
      signage_direction: { type: String, default: "" },
      compass_screenshot: { type: fileSchema, default: null },
      environmental_note: { type: String, default: "" },
    },
    product_requirements: {
      client_requirements: { type: String, default: "" },
      client_expectations: { type: String, default: "" },
      product_information: {
        product_category: { type: String, default: "" },
        product_name: { type: String, default: "" },
        product_code: { type: String, default: "" },
        visibility: { type: String, default: "" },
      },
      dimensions_quantity: {
        height: { type: String, default: "" },
        thickness: { type: String, default: "" },
        width: { type: String, default: "" },
        quantity: { type: Number, default: 0 },
      },
      additional_specifications: {
        light_option: { type: String, default: "" },
        layer_count: { type: String, default: "" },
        connection_point_details: { type: String, default: "" },
        visibility_distance: { type: String, default: "" },
        height_from_road: { type: String, default: "" },
      },
    },
  },
  { _id: false },
);

/* =====================================
   STEP 2
===================================== */

const step2Schema = new Schema(
  {
    image_section: {
      upload_mockup: { type: [fileSchema], default: [] },
      size_images: {
        height_image: { type: [fileSchema], default: [] },
        length_image: { type: [fileSchema], default: [] },
        thickness_image: { type: [fileSchema], default: [] },
      },
      other_images: {
        front_image: { type: [fileSchema], default: [] },
        left_image: { type: [fileSchema], default: [] },
        right_image: { type: [fileSchema], default: [] },
        back_image: { type: [fileSchema], default: [] },
        top_image: { type: [fileSchema], default: [] },
        bottom_image: { type: [fileSchema], default: [] },
        connection_point_image: { type: [fileSchema], default: [] },
        nearby_area_image: { type: [fileSchema], default: [] },
        bottom_to_top_image: { type: [fileSchema], default: [] },
        viewing_area_image: { type: [fileSchema], default: [] },
      },
    },
    video_section: {
      walkaround_360: { type: [fileSchema], default: [] },
      other_videos: {
        mockup_video: { type: [fileSchema], default: [] },
        combined_video: { type: [fileSchema], default: [] },
        far_to_near_video: { type: [fileSchema], default: [] },
        connection_point_video: { type: [fileSchema], default: [] },
      },
      size_videos: {
        height_videos: { type: [fileSchema], default: [] },
        length_videos: { type: [fileSchema], default: [] },
        thickness_videos: { type: [fileSchema], default: [] },
      },
    },
  },
  { _id: false },
);

/* =====================================
   STEP 3
===================================== */

const step3Schema = new Schema(
  {
    wall_surface_details: {
      surface_type: { type: String, default: "" },
      surface_condition: { type: String, default: "" },
      texture_notes: { type: String, default: "" },
    },
    signage_stability: {
      stability: { type: String, default: "" },
      mount_description: { type: String, default: "" },

      civil_work_required: { type: Boolean, default: false },
      civil_work_notes: {
        type: String,
        default: "",
        validate: {
          validator: function (value) {
            if (this.civil_work_required && !value) return false;
            return true;
          },
          message: "Civil work notes required if civil work is needed",
        },
      },

      fabrication_work_needed: { type: Boolean, default: false },
      fabrication_work_notes: {
        type: String,
        default: "",
        validate: {
          validator: function (value) {
            if (this.fabrication_work_needed && !value) return false;
            return true;
          },
          message: "Fabrication work notes required if fabrication is needed",
        },
      },

      surrounding_obstructions: { type: String, default: "" },
    },
    installation_equipment: {
      ladder: { type: Boolean, default: false },
      ladder_notes: { type: String, default: "" },
      bamboo: { type: Boolean, default: false },
      bamboo_notes: { type: String, default: "" },
      iron_ms: { type: Boolean, default: false },
      iron_ms_notes: { type: String, default: "" },
      table_stool: { type: Boolean, default: false },
      table_stool_notes: { type: String, default: "" },
      other_notes: { type: String, default: "" },
    },
    electrical_requirements: {
      power_connection_available: { type: Boolean, default: false },
      switchboard_distance: { type: String, default: "" },
      cable_route_notes: { type: String, default: "" },
      safety_notes: { type: String, default: "" },
      requirement_from_client: { type: String, default: "" },
      instruction_to_client: { type: String, default: "" },
    },
  },
  { _id: false },
);

/* =====================================
   STEP 4
===================================== */

const step4Schema = new Schema(
  {
    data_from_client: {
      content: { type: String, default: "" },
      content_file: { type: fileSchema, default: null },

      logo_cdr: { type: Boolean, default: false },
      logo_cdr_file: {
        type: fileSchema,
        default: null,
        validate: {
          validator: function (value) {
            if (this.logo_cdr && !value) return false;
            return true;
          },
          message: "Logo CDR file required if logo_cdr is true",
        },
      },

      want_to_make: { type: Boolean, default: false },
      logo_make_description: {
        type: String,
        default: "",
        validate: {
          validator: function (value) {
            if (this.want_to_make && !value) return false;
            return true;
          },
          message: "Logo description required if want_to_make is true",
        },
      },

      font_type: { type: String, default: "" },
      upload_font: { type: fileSchema, default: null },
    },

    color_combinations: {
      type: [
        {
          color_combination: { type: String, default: "" },
          color_code: { type: String, default: "" },
          color_reference: { type: fileSchema, default: null },
          summary: { type: String, default: "" },
        },
      ],
      default: [],
    },

    light_option: {
      light_option: { type: String, default: "" },
      light_color: { type: String, default: "" },
      light_color_ref: { type: fileSchema, default: null },
      description: { type: String, default: "" },
      signage_sample: { type: fileSchema, default: null },
    },

    additional_instructions: {
      client_requirement: { type: String, default: "" },
      client_to_installation: { type: String, default: "" },
      client_to_company: { type: String, default: "" },
      recce_to_design: { type: String, default: "" },
      recce_to_installation: { type: String, default: "" },
      recce_to_company: { type: String, default: "" },
      other_remark: { type: String, default: "" },
    },
  },
  { _id: false },
);

/* =====================================
   PRODUCT SCHEMA
===================================== */

const productSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "ClientProduct",
      required: true,
    },

    step1: { type: step1Schema, default: {} },
    step2: { type: step2Schema, default: {} },
    step3: { type: step3Schema, default: {} },
    step4: { type: step4Schema, default: {} },

    current_step: { type: Number, default: 1 },

    dss_compliance_checklist: { type: [String], default: [] },
    declaration: { type: Boolean, default: false },
    is_completed: { type: Boolean, default: false },
    completed_at: { type: Date, default: null },
    status: {
      type: String,
      enum: ["draft", "final"],
      default: "draft",
    },
    manager_approval: {
      approval_status: {
        type: String,
        enum: [
          "NA",
          "pending",
          "approved_by_manager",
          "modification_by_manager",
          "flag_by_manager",
        ],
        default: "NA",
      },
      action_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      manager_media: {
        type: [fileSchema],
        default: [],
      },
      manager_checklist: { type: [String], default: [] },

      action_at: {
        type: Date,
        default: null,
      },

      manager_remark: { type: String, default: "" },
    },
    send_to_design: {
      type: Boolean,
      default: false,
    },
    sent_to_design_at: {
      type: Date,
      default: null,
    },
  },
  { _id: true },
);

/* =====================================
   MAIN EXECUTION SCHEMA
===================================== */

const recceExecutionSchema = new Schema(
  {
    recce_assigned_id: {
      type: Schema.Types.ObjectId,
      ref: "RecceAssigned",
      required: true,
      index: true,
    },
    recce_detail_id: {
      type: Schema.Types.ObjectId,
      ref: "RecceDetail",
      required: true,
      index: true,
    },

    checklist: { type: [String], default: [] },

    raw_recce: {
      type: [
        {
          product_name: { type: String, default: "" },
          product_file: { type: fileSchema, default: null },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },

    products: { type: [productSchema], default: [] },
  },
  { timestamps: true },
);

const RecceExecutionModel = mongoose.model(
  "RecceExecutionModel",
  recceExecutionSchema,
);
export default RecceExecutionModel;
