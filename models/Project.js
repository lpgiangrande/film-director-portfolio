import mongoose from 'mongoose';
import slugify from 'slugify';

// PROJECT PAGE
/**
 * main_video = Vimeo player URL shown at the top of the page
 * blocks     = page content, in display order (built in the back office, see public/js/project-editor.js):
 *   { type: 'row',   items: [{ url, caption }], text }  -> 1 to 4 visuals (S3 .jpg / .mp4) side by side + text under the row
 *   { type: 'vimeo', url, text }                         -> Vimeo video + text under it
 *   { type: 'text',  text }                              -> paragraph alone
 *
 * Legacy fields (array_vids, video*_description, gallery, gallery_row_*_description) come from the
 * former fixed templates. They are no longer displayed: scripts/migrateProjectBlocks.js converted them
 * to main_video + blocks. Kept in the schema so the original data is not lost.
 */

const MAX_ITEMS_PER_ROW = 4;

const mediaSchema = mongoose.Schema({
    url: { type: String, required: true },
    caption: { type: String },
}, { _id: false });

const blockSchema = mongoose.Schema({
    type: { type: String, enum: ['row', 'vimeo', 'text'], required: true },
    items: {
        type: [mediaSchema],
        default: undefined,
        validate: {
            validator: items => !items || items.length <= MAX_ITEMS_PER_ROW,
            message: `${MAX_ITEMS_PER_ROW} visuels maximum par rangée`,
        },
    },
    url: { type: String },
    text: { type: String },
}, { _id: false });

const projectSchema = mongoose.Schema({

    thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thumbnail"
    },
    project_title: {
        type: String,
        required: true,
    },
    // Public URL = /project/<slug>, generated from the title (see pre('save') below)
    slug: {
        type: String, unique: true
    },
    // Slugs of former titles: their URLs redirect to the current one
    previous_slugs: {
        type: [String],
        index: true,
    },
    director: {
        type: String,
        required: true
    },
    other_contributors: {
        type: String,
    },
    productor: {
        type: String,
    },
    main_video: {
        type: String,
    },
    blocks: {
        type: [blockSchema],
        default: [],
    },

    // ---------- Legacy (see top of file) ---------- //
    array_vids: {
        type: [String],
    },
    video2_description: {
        type: String
    },
    video3_description: {
        type: String
    },
    video4_description: {
        type: String
    },
    video5_description: {
        type: String
    },
    video6_description: {
        type: String
    },
    video7_description: {
        type: String
    },
    gallery: {
        type: [String],
    },
    gallery_row_1_description: {
        type: String,
    },
    gallery_row_2_description: {
        type: String,
    },
    gallery_row_3_description: {
        type: String,
    },
    gallery_row_4_description: {
        type: String,
    }
});

// Slug from the title, made unique with -2, -3... if another project already uses it
projectSchema.statics.makeSlug = async function (title, projectId) {
    const base = slugify(title || '', { lower: true, strict: true }) || String(projectId);
    let slug = base;
    for (let n = 2; await this.exists({ slug, _id: { $ne: projectId } }); n++) {
        slug = `${base}-${n}`;
    }
    return slug;
};

// Generate the slug before saving; when the title changes, keep the old slug so its URL still works
projectSchema.pre('save', async function () {
    if (!this.isModified('project_title') && this.slug) return;

    const slug = await this.constructor.makeSlug(this.project_title, this._id);
    if (this.slug && this.slug !== slug && !this.previous_slugs.includes(this.slug)) {
        this.previous_slugs.push(this.slug);
    }
    this.slug = slug;
});

projectSchema.virtual('url').get(function () {
    return `/project/${this.slug}`;
});

export { MAX_ITEMS_PER_ROW };
export default mongoose.model('Project', projectSchema);
