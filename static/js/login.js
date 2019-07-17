
function login(by, info) {
  show(by, info)
  fetch('/_/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      loginInfo: { by: by, info: info },
      // @ts-ignore
      accessRequest: __.accessRequest
    })
  })
    .then(function (rawResponse) {
      return rawResponse.json();
    })
    .then(function (response) {
      console.log('login response: ', response);
    })
}


function show(by, info) {
  console.log(by, info)
  // var __info = Object.keys(info).reduce(function (_, k) {
  //   _[k] = info[k] === undefined ? null : info[k]
  //   return _
  // }, {})
  // document.getElementById('profile').innerHTML += '*****\n' + from + '\n\n' + JSON.stringify(__info, null, 4) + '\n******\n\n'
}