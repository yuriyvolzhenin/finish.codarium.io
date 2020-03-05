var allowedUsers = [
    {
        userName: "alex",
        password: "a",
        fullName: "Олександр"
    },
    {
        userName: "ann",
        password: "a",
        fullName: "Анна"
    },
    {
        userName: "test",
        password: "1",
        fullName: "Тестовий Користувач"
    }
];

function parseDataFromUrl() {
    // наприклад, адресний рядок після переходу з форми може бути таким:  .../js-test.html?username=SuperUser&pwd=SuperPass&remember=yes
    // тоді window.location.search буде: ?username=SuperUser&pwd=SuperPass&remember=yes

    var sPageURL = decodeURIComponent(window.location.search.substring(1));

    var dataFromUrl = sPageURL.split('&');

    // dataFromUrl[0] == "username=SuperUser"
    // dataFromUrl[1] == "username=SuperUser"

    var formData = {};

    // більш сучасно було б використати dataFromUrl.forEach(function(item) - але для простоти переберемо все звичним циклом
    // https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

    for(var i=0;i<dataFromUrl.length;i++)
    {
        var item = dataFromUrl[i]; // "name=value"

        //item: "name=value" => parts: ["name", "value"]
        var parts = item.split("=");
        formData[parts[0]] = parts[1];

        /*
            // formData це об'єкт (асоціативний масив), який може виглядати так:
            formData = {
                username: "SuperUser",
                pwd: "SuperPass",
                remember: "yes"
            }
         */
    }

    return formData;
}

function getUserIndexIfValid(userInfo, validUsersArray) {
    for(var i=0;i<validUsersArray.length;i++) {
        if(
            validUsersArray[i].userName.toLowerCase() == userInfo.username.toLowerCase()
            && validUsersArray[i].password == userInfo.pwd) {
            return i;
        }
    }
    return -1;
}

function logout() {
    console.log("logout called.");
    localStorage.removeItem('userData');
    window.location.href = "index.html";
}

var isUserValid = false;
var loggedInUser = null;

try {
    var userInfo = null;

    if(window.location.search != "") {
        userInfo = parseDataFromUrl();
        console.log("User info from url: ", userInfo);
    }
    else {
        userInfo = localStorage.getItem('userData');
        if(userInfo !== undefined) {
            userInfo = JSON.parse(userInfo);
        }
        console.log("User info from local storage: ", userInfo);
    }

    var userIndex = getUserIndexIfValid(userInfo, allowedUsers);

    if(userIndex >= 0) {
        isUserValid = true;
        loggedInUser = allowedUsers[userIndex];
        console.log("User logged in:", loggedInUser);
    }
}
catch(exObj) {
    console.log(exObj);
}

if( !isUserValid ) {
    console.error("User is not valid!", userInfo);
    window.location.href = "login.html?bad_user=1";
}
else {
    if(userInfo.remember == "on") {
        localStorage.setItem('userData', JSON.stringify(userInfo));
        console.log("Local storage set.", localStorage.getItem('userData'));
    }

    document.getElementById("userName").innerText = loggedInUser.fullName;
    document.getElementsByClassName("userPanel")[0].classList.add("loggedIn");

    document.getElementById("selectedCurrency").innerText = userInfo.currency;

    console.log("UI changed.");
}