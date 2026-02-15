import mongoose from "mongoose";

const LEVEL = ["High", "Medium", "Low"];
const YES_NO = ["Yes", "No"];
const DIRECTIONS = [
  "North",
  "South",
  "East",
  "West",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];

const RecceSchema = new mongoose.Schema(
  {
    /* ================= REFERENCES ================= */
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    /* ================= ENVIRONMENT ================= */
    environmentalConditions: {
      remark: String,
      sunlightExposure: { type: String, enum: LEVEL },
      rainExposure: { type: String, enum: LEVEL },
      windExposure: { type: String, enum: LEVEL },
      ambientLight: { type: String, enum: LEVEL },

      signageDirection: {
        direction: { type: String, enum: DIRECTIONS },
        compassScreenshot: String,
        environmentalNode: String,
      },
    },

    /* ================= PRODUCT REQUIREMENTS ================= */
    productRequirements: {
      remark: String,
      clientRequirements: String,
      clientExpectations: [String],

      productCategory: String,
      productName: String,
      productCode: String,

      visibility: String,
      quantity: Number,

      lightOption: String,
      layerCount: String,

      connectionPointDetails: String,
      visibilityDistanceFeet: String,
      heightFromRoadFeet: String,
    },

    /* ================= DIMENSIONS ================= */
    dimensions: {
      height: { value: Number, unit: String },
      width: { value: Number, unit: String },
      thickness: { value: Number, unit: String },
    },

    /* ================= MEDIA ================= */
    media: {
      photos: {
        remark: String,
        back: String,
        inside: String,
        front: String,
        left: String,
        right: String,
        top: String,
      },
      videos: {
        remark: String,
        walkaround360: String,
        front: String,
        side: String,
        right: String,
        top: String,
      },
    },

    /* ================= INSTALLATION ================= */
    installationDetails: {
      remark: String,

      surface: {
        type: {
          type: String,
        },
        condition: String,
        textureNotes: String,
      },

      stability: String,

      mount: {
        type: {
          type: String,
        },
        description: String,
      },

      civilWork: {
        required: String,
        description: String,
      },

      fabricationWork: {
        required: String,
      },

      equipment: {
        ladder: String,
        bamboo: String,
        ironMS: String,
        tableStool: String,
      },

      otherNotes: String,
    },

    /* ================= ELECTRICAL ================= */
    electricalRequirements: {
      powerConnectionAvailable: { type: String, enum: YES_NO },
      switchboardDistanceFeet: String,
      cableRouteNotes: String,
      safetyNotes: String,
    },

    /* ================= RAW RECCE ================= */
    rawRecce: [
      {
        remark: String,
        productName: String,
        description: String,
        image: String,
      },
    ],

    /* ================= DATA FROM CLIENT ================= */
    clientProvidedData: {
      remark: String,
      contentText: String,
      contentFile: String,

      logoRequired: { type: String, enum: YES_NO },
      logoFile: String,

      fontType: String,
      fontFile: String,

      colorCombination: String,
      colorCode: String,
      colorReference: String,

      detailSummary: String,

      lightOption: String,
      lightColor: String,
      lightColorReference: String,
      lightColorDescription: String,

      signageSampleReference: String,
    },

    /* ================= INSTRUCTIONS ================= */
    instructionsAndRemarks: {
      clientRequirement: String,
      clientToInstallation: String,
      clientToCompany: String,
      recceToDesign: String,
      recceToInstallation: String,
      recceToCompany: String,
      otherRemark: String,
    },

    /* ================= FINAL NOTES ================= */
    finalNotes: {
      additionalComments: String,
      additionalSafetyNotes: String,
    },

    /* ================= MANAGER CHECKLIST ================= */
    managerChecklist: {
      environmentalConditionsChecked: Boolean,
      productRequirementsChecked: Boolean,
      imagesUploaded: Boolean,
      videosUploaded: Boolean,
      installationDetailsChecked: Boolean,
      rawRecceChecked: Boolean,
      clientDataChecked: Boolean,
      accurateMeasurementsTaken: Boolean,
      instructionsConfirmed: Boolean,
      signageNameConfirmed: Boolean,
      submittedSameDay: Boolean,
    },
  },
  { timestamps: true }
);

const DummyRecce = mongoose.model("DummyRecce", RecceSchema);
export default DummyRecce;
