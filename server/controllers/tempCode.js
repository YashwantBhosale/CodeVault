const date = "2024-05-16T15:19:14.624Z"

date.split("-")[2].split("T")
// Array [ "16", "15:19:14.624Z" ]

date.split("-")[2].split("T")[0]
// "16" 