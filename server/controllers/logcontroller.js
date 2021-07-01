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

router.post("/log", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
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

router.get("/log", (req, res) => {
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

    router.get("/user", validateJWT, async (req, res) => {
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

router.put("/:id", validateJWT, async(req, res) => {
    const { description, definition, result } = req.body.log;
    const id = req.params.id;
    const ownerId = req.user.id;

    const query = {
        where: {
            id: id,
            owner: ownerId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete("/:id", validateJWT, async (req, res) => {
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