$(document).ready( function (){
  const publicKey = 'b20ac948a98524dacf76fab413cf9799';
  const privateKey = '91bdf082727faf4ad832646f2498a6319d80ac8d';
  const maxCharacters = 1500;
  function createHash(timeStamp) {
    const toBeHashed = timeStamp + privateKey + publicKey;
    const hashedMessage = toMD5(toBeHashed);
    return hashedMessage;
  }
  const timeStamp = Date.now().toString();
  const offset = Math.floor((Math.random() * maxCharacters) + 1);
  const hash = createHash(timeStamp);
  fetch('http://gateway.marvel.com/v1/public/characters?limit=20&offset='+offset+'&ts='+timeStamp+'&apikey='+publicKey+'&hash='+hash, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify()
  })
  .then(
    res=>res.json()
  )
  .then(
    res => {
      var element = res.data.results;
      for (var i = 0; i < 20; i++) {
        test = element[i].modified.split('T');
        var dataBR = test[0].split('-');
        dataBR.reverse();
        dataBR = dataBR[0] + '/' + dataBR[1] + '/' + dataBR[2];

        id = element[i].id;
        name = element[i].name;
        descricao = element[i].description;
        if (descricao == ''){
          descricao ='Indisponível';
        }
        $("#marvel").append(`
          <div class="col-sm-3">
            <div class="card" >
              <img class="card-img-top"  onClick=\'buscarPersonagem(this)\'  src="`+ element[i].thumbnail.path + "/portrait_incredible." + element[i].thumbnail.extension + `" alt="`+id+"*"+name+"*"+descricao+`">
              <div class="card-body">
                <h5 class="card-title">`+name+`</h5>
                <p class="card-text">Data de modificação: `+dataBR+`</p>
              </div>
            </div>
          </div>`
        );
      }
    }
  )
  .catch(error => {
    console.log(error);
  });
});


function buscarPersonagem(img) {
  alt = new Array;
  alt = img.alt

  info = alt.split('*');
  idPersonagem = info[0];
  namePersonagem = info[1];
  descricaoPersonagem = info[2];

  $("#personagem").empty();
  $("#descricaoText").empty();
  var url =  "http://gateway.marvel.com/v1/public/characters/" + idPersonagem + "/comics?ts=1&apikey=b20ac948a98524dacf76fab413cf9799&hash=de2670f8f60158cd21b66b3d08f895b2";
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify()
  })
  .then(
    res=>res.json()
  )
  .then(
    res => {
      $('#exampleModalLong').modal('show')
      var element = res.data.results;
      $('#tituloModal').text(namePersonagem);
      $("#descricaoText").append(
        `<h5>Descrição:</h5>
        <h6 >` +descricaoPersonagem+ `</h6>
        <br>`);
      for (var i = 0; i < 10; i++) {

        $("#personagem").append(`
          <div class="row">
            <div class="col-md-5">
              <a href=`+element[i].urls[0].url+` target="_blank" ><img src="`+ element[i].thumbnail.path + "/portrait_xlarge." + element[i].thumbnail.extension + `" alt=""/></a>
            </div>
            <div class="col-md-7">
              <br><br><br>
              <strong>`+element[i].title+`</strong>
            </div>
          </div>
        `);
      }
    }
  )
  .catch(error => {
  });
}
