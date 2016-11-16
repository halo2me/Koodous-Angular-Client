npm install -g yuglify
mkdir compiled
yuglify assets/css/*.css -c compiled/styles
yuglify app/*.js app/**/*.js app/**/**/*.js -c compiled/app
yuglify assets/js/codemirror.js assets/js/codemirror_yara.js assets/js/moment-with-locales.js assets/js/qrcode.min.js -c compiled/assets
yuglify assets/js/mentio.min.js assets/js/angular*.js assets/js/ui*.js -c compiled/angular-assets
cp index_prod.html compiled/index.html