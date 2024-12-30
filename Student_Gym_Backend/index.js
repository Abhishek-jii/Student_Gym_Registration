import {app} from "./app.js"
import {db} from "./db.js"






db.connect()
.then(() => {
    app.listen(3000, () => {
        console.log("Servver is running on port: ",3000)
    })
})