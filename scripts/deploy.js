#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const S3_BUCKET = 'ps5.jsarias.me';
const BUILD_DIR = 'dist';
const AWS_REGION = 'us-east-1'; // Change this if your bucket is in a different region
const AWS_PROFILE = 'personal';

console.log('🚀 Starting deployment...');

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ Build directory not found. Please run "npm run build" first.');
  process.exit(1);
}

try {
  console.log('📦 Copying files to S3...');
  
  // Copy all files from dist directory to S3 bucket
  // Using cp instead of sync to preserve existing files
  // --recursive flag to copy all files and subdirectories
  // --cache-control sets appropriate caching headers
  const copyCommand = `AWS_PROFILE=${AWS_PROFILE} aws s3 cp ${BUILD_DIR}/ s3://${S3_BUCKET}/ --recursive --cache-control "max-age=31536000,public" --region ${AWS_REGION}`;
  
  console.log(`Executing: ${copyCommand}`);
  execSync(copyCommand, { stdio: 'inherit' });
  
  console.log('✅ Files uploaded successfully!');
  
  // Upload index.html with different cache control for SPA routing
  console.log('📄 Uploading index.html with no-cache...');
  const indexCommand = `AWS_PROFILE=${AWS_PROFILE} aws s3 cp ${BUILD_DIR}/index.html s3://${S3_BUCKET}/index.html --cache-control "no-cache,no-store,must-revalidate" --region ${AWS_REGION}`;
  
  console.log(`Executing: ${indexCommand}`);
  execSync(indexCommand, { stdio: 'inherit' });
  
  console.log('✅ index.html uploaded with no-cache!');
  
  // Set up S3 bucket for SPA routing (redirect 404s to index.html)
  console.log('🔧 Setting up SPA routing...');
  const websiteConfig = {
    IndexDocument: { Suffix: 'index.html' },
    ErrorDocument: { Key: 'index.html' }
  };
  
  const websiteCommand = `AWS_PROFILE=${AWS_PROFILE} aws s3api put-bucket-website --bucket ${S3_BUCKET} --website-configuration '${JSON.stringify(websiteConfig)}' --region ${AWS_REGION}`;
  
  console.log(`Executing: ${websiteCommand}`);
  execSync(websiteCommand, { stdio: 'inherit' });
  
  console.log('✅ SPA routing configured!');
  
  console.log('🎉 Deployment completed successfully!');
  console.log(`🌐 Your app is now live at: https://${S3_BUCKET}`);
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
