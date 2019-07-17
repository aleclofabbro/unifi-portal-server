
// @ts-ignore
window.fbAsyncInit = function () {
  // @ts-ignore
  FB.init({
    // @ts-ignore
    appId: __.social.FB.fbAppId,
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v3.3'
  });
};
function FBlogin() {
  // @ts-ignore
  FB.login(function (response) {
    if (response.authResponse) {
      // @ts-ignore
      FB.api(
        '/me',
        'GET',
        { "fields": "birthday,email,hometown,age_range,first_name,gender,last_name,link,location,middle_name,name,address,id,friends.limit(100){email,first_name,gender,id,birthday,age_range,address,about},picture{cache_key,is_silhouette,height,width,url}" },
        function (response) {
          login('FB', response)
        }
      );
    } else {
      console.log('FB not loggede in: User cancelled login or did not fully authorize.', response);
    }
  }, { auth_type: 'reauthorize', scope: 'public_profile,user_friends,email,user_birthday,user_hometown,user_location,user_gender,user_age_range,user_link,user_likes,user_posts,user_tagged_places,user_videos', return_scopes: true });
}