import {app} from "./app.js"
import {db} from "./db.js"






db.connect()
.then(() => {
    app.listen(8000, () => {
        console.log("Servver is running on port: ",8000)
    })
})