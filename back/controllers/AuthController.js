const {hash} = require('../util/hash');

exports.createUser = async (req, res) => {
    const { email, pseudo, password } = req.body;
    
    try {
        const user_insert = await db.query(`INSERT INTO user SET email= :email, pseudo= :pseudo, password= :password;`, {email, pseudo, password: hash(password)});
        const user_avatar = await db.query(`INSERT INTO pictureBank SET num_user= '${user_insert.insertId}';`)
        const user_insert_role = await db.query(`INSERT INTO user_role SET num_user= '${user_insert.insertId}';`);
        const user_insert_address = await db.query(`INSERT INTO user_address SET num_user= '${user_insert.insertId}';`);
        const user_insert_profil = await db.query(`INSERT INTO user_profil SET num_user= '${user_insert.insertId}';`);
    } catch (err) {
        throw err;
    }
    res.redirect('back');
}

exports.loginUser = async (req, res) => {
    const {pseudo} = req.body;
    
    try {

        const user_connect = await db.query(`SELECT user.num_user, user.email, user.pseudo, pictureBank.link_picture, user_role.isVerify, user_role.isAdmin, user_role.isBan FROM user INNER JOIN pictureBank ON pictureBank.num_user = user.num_user INNER JOIN user_role ON user_role.num_user = user.num_user WHERE (pseudo= :pseudo OR email= :pseudo);`, {pseudo});
        const session_kill = await db.query(`DELETE FROM sessions WHERE data LIKE '%"id":${user_connect[0].num_user}%';`);
        req.session.user = {id: user_connect[0].num_user, email: user_connect[0].email, avatar: user_connect[0].link_picture, pseudo: user_connect[0].pseudo, isVerify: user_connect[0].isVerify, isAdmin: user_connect[0].isAdmin};
            
        res.redirect('back');

    } catch (err) {
        throw err;
    }
}

exports.logOut = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('sessionID');
        console.log("Clear Cookie session log :", req.session);
        res.redirect('back');
    })
}
