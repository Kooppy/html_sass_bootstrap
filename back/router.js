/*
 * Router.js
 * *********** */

// Import de module
const express = require('express'),
      router = express.Router(),
      auth = require('./middleware/auth.js'),
      upload = require('./config/multer'),
      {  configRegister, configLogin, configForgot, configResetPassword, configComment, configEditUser, configSendMessage } = require('./config/validator'),
      { validate } = require('./middleware/index.js'),
      sharp = require('./config/sharp');


// Import des modules dans les controllers
const {
      home,
      createUser,
      loginUser,
      forgot,
      profilID,
      editProfil,
      comment,
      deleteComment,
      logOut,
      resetPassword, 
      reset,
      admin,
      addUser,
      editUser,
      banUser,
      archivingUser,
      deleteUser,
      addBlog,
      editBlog,
      deleteBlog,
      addGallery,
      editGallery,
      deleteGallery,
      sendMessage,
      blog,
      blogID
} = require('./controllers'); 

// Routes

router.route('/').get(home);

router.route('/contact').post(validate(configSendMessage()), sendMessage);

router.route('/register').post(validate(configRegister()), createUser);

router.route('/login').post(validate(configLogin()), loginUser);

router.route('/profil/:id').get(auth.isVerify, profilID).put(validate(configEditUser()), upload.single('picUser'), editProfil);

router.route('/logout').delete(logOut);

router.route('/forgot').post(validate(configForgot()), forgot);

router.route('/resetPassword/:id').get(auth.isForgot, resetPassword).put(validate(configResetPassword()), reset);

router.route('/blog').get(blog);

router.route('/blog/:id').get(blogID).post(validate(configComment()), comment);

router.route('/comment/:id').delete(deleteComment);

//router.use(auth.isAdmin)

router.route('/admin').get(auth.isAdmin, admin);

router.route('/admin/user').post(auth.isAdmin, addUser);

router.route('/admin/user/:id').put(auth.isAdmin, upload.single('picUser'), editUser).delete(deleteUser);

router.route('/admin/user/ban/:id').put(auth.isAdmin, banUser);

router.route('/admin/user/archiving/:id').put(auth.isAdmin, archivingUser);

router.route('/admin/blog').post(auth.isAdmin, upload.single('picBlog'), sharp, addBlog);

router.route('/admin/blog/:id').put(auth.isAdmin, upload.single('picBlog'), editBlog).delete(auth.isAdmin, deleteBlog);

router.route('/admin/gallery').post(auth.isAdmin, upload.single('picGallery'), addGallery);

router.route('/admin/gallery/:id').put(auth.isAdmin, upload.single('picGallery'), editGallery).delete(auth.isAdmin, deleteGallery);

// /Routes

// Export de notre router
module.exports = router;