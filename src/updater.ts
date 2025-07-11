import { main } from "./app";


main().catch((error) => {
  console.log("There was an error running the updator: ", error)
}).finally(() => {
  console.log("Updator ran")
})
