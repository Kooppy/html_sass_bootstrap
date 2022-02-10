const { check } = require('express-validator'), 
      //{ validate } = require('../../middleware/validate'), 
      { selectID } = require('../../util/select'),
      { hash } = require('../../util/hash');

exports.methodValidate = (method) => {
    switch (method) {
        case 'register':
            return [check('pseudo')
                    .isLength({
                        min: 8
                    })
                    .withMessage('Votre pseudo doit faire 8 caractère mini.'),
                    check('pseudo').custom((async value => {
                        const userPseudo = await selectID('count(*) as num', 'user', 'pseudo', value);

                        if (userPseudo. num === 1) {
                            throw new Error('Le pseudo est déjà prit !');
                        }
                        return true;
                    })),
                    check('email')
                    .isEmail()
                    .withMessage('Email invalide'),
                    check('email').custom((async value  => {
                        const userEmail = await selectID('count(*) as num', 'user', 'email', value);

                        if (userEmail.num === 1) {
                            throw new Error('Un compte existe déjà avec cet email !');
                        }
                        return true;
                    })),
                    check('password')
                    .matches(/^(?=.*\d)[0-9a-zA-Z\%\@]{1,}$/)
                    .withMessage(' 1 Chiffre.')
                    .matches(/^(?=.*[a-z])[0-9a-zA-Z\%\@]{1,}$/)
                    .withMessage(' 1 caractère minuscule.')
                    .matches(/^(?=.*[\%\@])[0-9a-zA-Z\%\@]{1,}$/)
                    .withMessage(' 1 caractère spéciale.')
                    .matches(/^(?=.*[A-Z])[0-9a-zA-Z\%\@]{1,}$/)
                    .withMessage(' 1 Majuscule.')
                    .isLength({ min: 8 })
                    .withMessage('Doit faire 8 caractère minimum.'),
                    check('password').custom((value, {
                        req
                    }) => {
                        if (value !== req.body.cPassword) {
                            throw new Error('La confirmation de mot de passe est incorrecte !');
                        }
                        return true;
                    })
                ];
        case 'login':
            return [check('pseudo').custom((async (value, { req } ) => {
                    const user = await selectID('password', 'user', 'pseudo= :value OR email= :value', value);
                    if ( !user || user.password !== hash(req.body.password) ) {
                        throw new Error('Erreur de connexion login ou mot de passe faux !');
                    }
                    return true;
                }))];
        default:
            break;
    }



}