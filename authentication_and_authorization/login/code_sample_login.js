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
              
                const token = JWT.generate({ user: user._id });
                return res.status(200).json({
                    user,
                    token,
                    code: 200,
                });
            } else {
                let ErrorMsg = email
                    ? "Account does not exist"
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