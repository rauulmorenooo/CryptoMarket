const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

class Validator {
    static isValidFirstName(fname) {
        return (fname != '' && fname.length <= 60);
    };

    static isValidLastName(lname) {
        return (lname != '' && lname.length <= 60);
    };

    static isValidUsername(username) {
        return (username != '' && username.length >= 5 && username.length <= 20);
    };

    static isValidEmail(email) {
        return (email != '' && emailRegex.test(email));
    }

    static isValidPassword(password) {
        return (password != '' && password.length >= 6 && password.length <= 20); 
    };
};

module.exports = Validator;