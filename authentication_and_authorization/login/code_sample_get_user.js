   getUserByAggregate: async query => {
        query = [
            { email: query.email },
            { username: query.username },
            { google_id_token: query.google_id_token },
        ];
        
        let queryArray = [];
        query.forEach(e => {
            e = removeObjectNullValues(e);
            Object.keys(e).length > 0 ? queryArray.push(e) : null;
        });

        let userObject = User.aggregate([
            {
                $match: {
                    $or: queryArray,
                },
            },
            {
                $lookup: {
                    from: "abilities",
                    localField: "_id",
                    foreignField: "userId",
                    as: "user_abilities",
                },
            },
            {
                $lookup: {
                    from: "skills",
                    localField: "_id",
                    foreignField: "userId",
                    as: "user_skills",
                },
            },
            {
                $lookup: {
                    from: "talentexperiences",
                    localField: "_id",
                    foreignField: "talentId",
                    as: "user_talent_experiences",
                },
            },
        ]);

        userObject = await userObject.exec();
        return userObject.length > 0 ? userObject[0] : null;
    },