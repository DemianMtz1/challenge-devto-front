$("#users-selector").change(ev => {
    let currentUserInfo = filteredUserById(getUsers(), ev.target.value);
    printViewUserInfo(getUsers())
});