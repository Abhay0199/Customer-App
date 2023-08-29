let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GEt, POST , OPTIONS, PUT, PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();
});
const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let { customerData } = require("./customerData.js");

// app.get('/customers', function (req, res) {
//     res.send(customerData)
// });
app.get('/customers', (req, res) => {
    let filteredCustomers = [...customerData];

    const { city, gender, payment, sortBy } = req.query;

    if (city) {
        filteredCustomers = filteredCustomers.filter(customer => customer.city === city);
    }

    if (gender) {
        filteredCustomers = filteredCustomers.filter(customer => customer.gender === gender);
    }

    if (payment) {
        filteredCustomers = filteredCustomers.filter(customer => customer.payment === payment);
    }

    if (sortBy) {
        switch (sortBy) {
            case 'city':
                filteredCustomers.sort((a, b) => a.city.localeCompare(b.city));
                break;
            case 'age':
                filteredCustomers.sort((a, b) => a.age - b.age);
                break;
            case 'payment':
                filteredCustomers.sort((a, b) => a.payment.localeCompare(b.payment));
                break;
            default:
                // Invalid sortBy value
                return res.status(400).json({ error: 'Invalid sortBy parameter' });
        }
    }

    res.json(filteredCustomers);
});

app.get("/customers/:id", function (req, res) {
    let id = req.params.id;
    const arr1 = customerData.filter((st) => st.id === id)
    res.send(arr1);
})
app

app.post('/customers', (req, res) => {
    let body = req.body;
    let newcustomer = { ...body }
    customerData.push(newcustomer);
    res.send(newcustomer);
});

app.put("/customers/:id", function (req, res) {
    let id = req.params.id;
    let body = req.body;
    let index = customerData.findIndex((st) => st.id === id);
    if (index >= 0) {
        let updatedcustomer = { ...body };
        customerData[index] = updatedcustomer;
        res.send(updatedcustomer)
    }
    else
        res.status(404).send("No Customer found")
});

app.delete("/customers/:id", function (req, res) {
    let id = req.params.id;
    let index = customerData.findIndex((st) => st.id === id);
    let deletedcustomer = customerData.splice(index, 1);
    res.send(deletedcustomer)
});