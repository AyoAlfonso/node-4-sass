  login: async (req, res) => {
        try {

            let query = req.body;

            let userObject = await userHelper.getUserByAggregate(query);

            if (!userObject) {
                return res.status(400).json({
                    error: "User does not exist",
                    code: 400,
                });
            }
            if (userObject.google_id_token && !userObject.password) {
                return res.status(400).json({
                    message: "Login through Google",
                    code: 400,
                    redirectUrl: "/api/google_authentication",
                });
            }

            if (userObject) {
                let passwordMatch = await bcrypt.compare(
                    req.body.password,
                    userObject.password
                );

                if (!userObject.verified) {
                    return res.status(400).json({
                        error: "User not verified yet",
                        code: 400,
                    });
                }
                if (!passwordMatch) {
                    return res.status(400).json({
                        error: "Incorrect password",
                        code: 400,
                    });
                }

                const token = getJWT.generateToken({ user: user._id });
                getJWT.decodeToken(token, (err, decoded) => {
                    if (err) {
                        return res.status(400).json({
                            error: err.message,
                            code: 400,
                        });
                    }
                    return res.status(200).json({
                        user,
                        token,
                        expiry: decoded.exp,
                        code: 200,
                    });
                });
            } else {
                let ErrorMsg = email
                    ? "Email does not exist"
                    : username
                    ? "Username does not exist"
                    : "Invalid email/username";
                res.status(400).json({
                    message: ErrorMsg,
                    code: 400,
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error,
                code: 500,
            });
        }
    },