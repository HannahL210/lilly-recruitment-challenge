document.addEventListener("DOMContentLoaded", function(){
    fetchMedicines();
    handleSubmit("add-medicine", "POST", "http://localhost:8000/create");
    handleSubmit("update-medicine", "POST", "http://localhost:8000/update");
    handleSubmit("delete-medicine", "DELETE", "http://localhost:8000/delete");
});

function handleSubmit(formId, requestType, url){
    const form = document.getElementById(formId);
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const submissionData = getsubmissionData(formId);

        const formData = new FormData();
        for(const key in submissionData){
            formData.append(key, submissionData[key]);
        }

        fetch(url, {
            method: requestType,
            body: formData
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Failed to complete the action');
            }
            return response.json();
        })
        .then(data =>{
            if(data.message){
                document.getElementById("message").textContent = data.message;
                fetchMedicines();
            }else{
                document.getElementById("message").textContent = "Failed to save changes";
            }
        })
        .catch(error => {
            console.error(`Error during ${requestType} request:`, error);
            document.getElementById("message").textContent = `Error during ${requestType} operation.`;
        });
    });
}

function getsubmissionData(formId){
    const form = document.getElementById(formId);
    const name = form.querySelector("[name= 'name']").value;
    const price = form.querySelector("[name= 'price']")? parseFloat(form.querySelector("[name= 'price']").value): null;

    return price ? {name, price} : {name};
}

function fetchMedicines(){
    fetch("http://localhost:8000/medicines")
    .then(response => {
        if(!response.ok){
            throw new Error("Failed to fetch medicines");
        }
        return response.json();
    })
    .then(data => {
        const medicineList = document.getElementById("medicines-list");
        medicineList.innerHTML = '';

        if (data && Array.isArray(data.medicines)){
            data.medicines.forEach(med => {
                const name= med.name || "Unknown Medicine";
                const price = med.price != null ? `$${med.price}`: "Price Not Available";

                const listItem = document.createElement("li");
                listItem.textContent = `${name} - ${price}`;
                medicineList.appendChild(listItem);
            });
        } else{
            document.getElementById("message").textContent = "No medicines available";
        }
    })
    .catch(error => {
        console.error("Error fetching medicines:", error);
        document.getElementById("message").textContent = "Error fetching medicines.";
    });
}

function showProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';
    setTimeout(() => progressBar.style.width = '100%', 100);
}

document.addEventListener('DOMContentLoaded', showProgressBar);