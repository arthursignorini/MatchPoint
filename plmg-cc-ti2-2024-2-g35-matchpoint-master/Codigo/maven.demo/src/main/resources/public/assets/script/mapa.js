var destination = "Complexo Esportivo PUC Minas";

function getRoute() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                var directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}&travelmode=driving`;

                window.location.href = directionsUrl;
            },
            function(error) {
                alert("Erro ao obter localização: " + error.message);
            }
        );
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
}

document.getElementById('submitEndereco').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém os valores do formulário
    var endereco = document.getElementById('endereco').value;
    var bairro = document.getElementById('bairro').value;
    var cep = document.getElementById('cep').value;

    // Monta o endereço completo
    var fullAddress = `${endereco}, ${bairro}, ${cep}`.replace(/\s/g, '+');

    var directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fullAddress}&destination=${destination}&travelmode=driving`;
    
    window.open(directionsUrl,'_black');
});