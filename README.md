# ZFilterHub

## License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE file](README.md) for details.

By using this code, you agree that any modifications or distributions must also be licensed under GPLv3.

## Disclaimer
This software is provided AS-IS without any warranty. Use at your own risk.

## Exemple of use
```typescript
import {EventMap, FilterMap, ZFilterHub} from "zfilterhub";

// With filters, and if a value **becomes** undefined/null/false, the filter will stop and return it

interface IFilters extends FilterMap {
    aBooleanFilter: [[arg1:object], boolean]
    another: [[myArg: string, mySecondArg: string], string]
}
interface IEvents extends EventMap {
    newLorem: [arg1:string, arg2:boolean, arg3:boolean]
}

const myFilterAndEvent = new ZFilterHub<IFilters, IEvents>();


myFilterAndEvent.addFilter('aBooleanFilter', function (value:boolean, arg1:object) {
    // somesthing
    return true;
});
console.dir(myFilterAndEvent.applyFilter('aBooleanFilter', /* initial filter value */ true, { lorem: 'ipsum' }))

myFilterAndEvent.addFilter('another', function (value:string, arg1:string, arg2:boolean, arg3:boolean) {
    // somesthing
    return value;
});
console.dir(myFilterAndEvent.applyFilter('another', /* initial filter value */ "myInitialString", "lorem", false, true))

myFilterAndEvent.emit('newLorem', 'lorem', true, new Date());
```
