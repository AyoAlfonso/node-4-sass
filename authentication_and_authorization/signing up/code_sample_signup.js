 createUser: async (req, res) => {
        const code = Math.floor(1000 + Math.random() * 9000)
        const smsParams = {
            Message: `AMPZ CODE: ${code} . Your code should not be shared with anyone.`,
            MessageStructure: "string",
            from: "AMPZ",
        }

        let user
        try { 
            req.body.code = code
            let existingUser = await User.findOne({
                email: req.body.email,
            })

            if (existingUser && !existingUser.verified) {
                await existingUser.remove()
            }

            if (req.body.age) {
                req.body = dateTransformer(req.body, ["dob"])
            }
            user = await User.create(req.body)
            if (user) {
                await helper.sendText(smsParams)
                await SendGrid.sendWelcomeEmail({
                    toEmail: req.body.email,
                    senderEmail: credential.customerHelpEmail,
                    username: req.body.username,
                    subject: `Welcome To AMPZ ${req.body.username}!`,
                    code,
                }).catch(err => {
                    return res.status(500).json({
                        message: "Unable to send email to verify user",
                        code: 500,
                    })
                })

                return res.status(201).json({
                    code: 201,
                    user,
                })
            }
            if (!user) {
                return res.status(400).json({
                    code: 400,
                    error: "Something went wrong",
                })
            }
        } catch (err) {
            if (err.name == "ValidationError") {
                return errorHandler.dbError(err, res)
            }
            return res.status(500).json({
                code: 500,
                error: err.message,
            })
        }
    },