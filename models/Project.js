import mongoose from 'mongoose';
import slugify from 'slugify';

// PROJECT PAGE
/**
 * array_vids = Main videos (full width on the page)
 * gallery = Gallery of visuals  | 1 to 4 rows of 3 images/videos
 * gallery_row_n_description = text under each rows of visuals 
 */

const projectSchema = mongoose.Schema({

    thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thumbnail"
    },
    project_title: {
        type: String,
        required: true,
    },
    slug: {
        type: String, unique: true
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
    // Liens vimeo, max 7 :
    array_vids: {
        type: [String],
        required: true
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
    // Images ou vids, max 16
    gallery: {
        type: [String],
        required: true
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

// Middleware pour générer le slug avant sauvegarde
projectSchema.pre('save', function (next) {
    if (this.isModified('project_title') || !this.slug) {
        this.slug = slugify(this.project_title, { lower: true, strict: true });
    }
    next();
});

export default mongoose.model('Project', projectSchema);
