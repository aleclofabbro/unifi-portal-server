// @ts-ignore
gapi.load('auth2', function () {
  // @ts-ignore
  auth2 = gapi.auth2.init({
    // @ts-ignore
    client_id: __.social.GG.ggClientId,
    fetch_basic_profile: false,
    scope: 'email profile openid'
  });
});

function GGlogin() {
  // @ts-ignore
  auth2.signIn().then(function (v) {
    console.log(v)
    // @ts-ignore
    var googleUser = auth2.currentUser.get()
    console.log('**GGlogin', googleUser); // Do not send to your backend! Use an ID token instead.
    var profile = googleUser.getBasicProfile();
    console.log('**profile', profile); // Do not send to your backend! Use an ID token instead.
    // var profile = auth2.currentUser.get().getBasicProfile();
    var obj = {
      id: profile.getId(), // Do not send to your backend! Use an ID token instead.
      email: profile.getEmail(), // This is null if the 'email' scope is not present.
      name: profile.getName(),
      givenName: profile.getGivenName(),
      familyName: profile.getFamilyName(),
      imageUrl: profile.getImageUrl(),
    }
    login('GG', obj)
  }, function (e) {
    console.log('GG not loggede in:', e)
  });

}