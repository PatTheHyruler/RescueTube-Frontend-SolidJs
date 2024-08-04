import fs from 'fs';
import { glob } from 'glob';
import css from 'css';

/**
 * @param s {string}
 * @return {string}
 */
function dashesToCamelCase(s) {
    return s.replace(
        /([A-Za-z])-([A-Za-z])/,
        (_, s1, s2) => s1 + s2.toUpperCase()
    );
    // Unsure what should be done with names such as --my-class or my--class, so just not touching them for now
}

const files = await glob('src/**/*.module.css');

files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const parsedCss = css.parse(content);
    const transformedClassNames = parsedCss.stylesheet.rules
        .map(
            (rule) =>
                rule.selectors?.map(
                    (selector) => selector.match(/(\.[A-Za-z0-9\-_]+)/g) // extract class selectors
                ) ?? []
        )
        .flat(2)
        .map((className) => dashesToCamelCase(className.slice(1)))
        .filter((value, index, array) => array.indexOf(value) === index); // remove duplicates

    const types = transformedClassNames
        .map((name) => `  readonly ${name}: string;`)
        .join('\n');
    const dtsContent = `declare const styles: {\n${types}\n};\nexport default styles;\n`;

    const dtsFile = file.replace('.css', '.css.d.ts');
    fs.writeFileSync(dtsFile, dtsContent, 'utf-8');
    console.log(`Generated ${dtsFile}`);
});
