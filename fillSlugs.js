import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import slugify from 'slugify';

dotenv.config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const fillSlugs = async () => {
    try {
        const projects = await Project.find();
        for (const proj of projects) {
            if (!proj.slug) {
                proj.slug = slugify(proj.project_title, { lower: true, strict: true });
                await proj.save();
                console.log(`Slug créé pour ${proj.project_title}: ${proj.slug}`);
            }
        }
        console.log('Tous les slugs générés.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

dbConnect().then(fillSlugs);
