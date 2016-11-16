yuglify assets/css/*.css -c compiled/styles
yuglify app/*.js app/**/*.js app/**/**/*.js -c compiled/app

# <script src="assets/js/codemirror.js"></script>
# <script src="assets/js/codemirror_yara.js"></script>
# <script src="assets/js/moment-with-locales.js"></script>
# <script src="assets/js/qrcode.min.js"></script>

yuglify assets/js/codemirror.js assets/js/codemirror_yara.js assets/js/moment-with-locales.js assets/js/qrcode.min.js -c compiled/assets
yuglify assets/js/mentio.min.js assets/js/angular*.js assets/js/ui*.js -c compiled/angular-assets

netlify deploy