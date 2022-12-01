function searchOn(words, find, limit) {
    if(words == undefined || !Array.isArray(words)) {
        return [];
    }

    if(find == undefined || String(find).length <= 0) {
        return [];
    }

    if(limit == undefined || isNaN(limit)) {
        limit = null;
    }

    let matches = [];
    words.forEach((word) => {
        if(limit == 0) {
            return matches;
        }

        if(word.toLowerCase() != find.toLowerCase()) {
            
            if(word.toLowerCase().substr(0, find.length) == find.toLowerCase()) {
                matches.push(word);
                
                if(limit !== null) {
                    limit--;
                }
            }
        }
    });

    return matches;
}

let countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'BurkinaFaso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Congo',
    'CostaRica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican',
    'EastTimor',
    'Ecuador',
    'Egypt',
    'ElSalvador',
    'EquatorialGuinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'TheGambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'GuineaBissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'NorthKorea',
    'SouthKorea',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'NewZealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'PapuaNewGuinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'SaintKitts',
    'SaintLucia',
    'SaintVincent',
    'Samoa',
    'SanMarino',
    'SaoTome',
    'SaudiArabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'SierraLeone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon',
    'Somalia',
    'SouthAfrica',
    'Spain',
    'SriLanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Togo',
    'Tonga',
    'Trinidad',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'UnitedArabEmirates',
    'UnitedKingdom',
    'UnitedStates',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
];

let textboxes = document.querySelectorAll('.completeIt');
console.log(textboxes);
textboxes.forEach((textbox) => {
    let input = textbox.querySelector('input[type="text"]');
    let autoComplete = textbox.querySelector('.auto_complete_place');

    input.addEventListener('input', () => {
        let val = input.value;

        let matches = searchOn(countries, val, 6);
        
        let items = autoComplete.querySelectorAll('.list-group-item');
        
        let remains = [];
        items.forEach((item) => {
            let save = false;
            matches.forEach((match) => {
                if(item.dataset.value == match) {
                    save = true;
                    remains.push(match);
                }
            });

            if(!save) {
                item.remove();
            }
        });

        matches.forEach((match, index) => {
            if(!remains.includes(match)) {
                // let item = document.createElement('a'); //li
                let item = document.createElement('li');
                item.classList.add('list-group-item');
                // item.setAttribute('href', '#');

                item.innerHTML = match;
                item.dataset.value = match;

                item.addEventListener('click', (event) => {
                    event.preventDefault();

                    input.value = match;

                    autoComplete.querySelectorAll('.list-group-item').forEach((item) => {
                        item.remove();
                    });

                    input.focus();
                });

                setTimeout(() => {
                    autoComplete.appendChild(item);
                }, index * 50);
            }
        });
    });

    input.addEventListener('keyup', (event) => {
        if(event.keyCode == 40) {
            let firstItem = autoComplete.querySelector('.list-group-item');
            if(firstItem != undefined) {
                firstItem.focus();
            }
        }
    });
});