const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");
// const Journal = require("../models/journal");

// router.get("/practice", validateJWT, (req, res) => {
//     res.send('This is your practice route.')
// });

router.get("/practice", validateJWT, (req, res) => {
    res.send('This is your practice route.')
});

router.post("/create", validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        title,
        date,
        entry,
        owner: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    //JournalModel.create(journalEntry) (LOOK above)
});

router.get("/about", (req, res) => {
    res.send('This is your about route.')
});

// router.get("/about", (req, res) => {
//     res.send('Hey, this changed your route. FWIW.')

// });

router.get("/", async(req, res) => {
    try {
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    });

    router.get("/mine", validateJWT, async (req, res) => {
        const { id } = req.user;
        try {
            const userLogs = await LogModel.findAll({
                where: {
                    owner: id
                }
            });
            res.status(200).json(userLogs);
        } catch (err) {
            res.status(500).json({ error: err });    
        }
    });

    router.get("/:title", async (req, res) => {
        const { title } = req.params;
    try {
        const results = await LogModel.findAll({
            where: { title: title }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    });

router.put("/update/:entryId", validateJWT, async(req, res) => {
    const { title, date, entry } = req.body.log;
    const logId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner: userId
        }
    };

    const updatedLog = {
        title: title,
        date: date,
        entry: entry
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner: ownerId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({ message: "Log entry removed" });
    } catch (err) {
        res.status(500).json({ error: err });
     }
    });


module.exports = router;