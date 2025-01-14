import { pestProject } from '../__tests__/utils';
import { PHPUnitXML } from '../PHPUnitXML';
import { TestParser } from './TestParser';
import { TestDefinition, TestType } from './types';

export const parse = (buffer: Buffer | string, file: string) => {
    const tests: TestDefinition[] = [];
    const phpUnitXML = new PHPUnitXML();
    phpUnitXML.setRoot(pestProject(''));
    const testParser = new TestParser(phpUnitXML);

    testParser.on(TestType.namespace, (testDefinition: TestDefinition) => tests.push(testDefinition));
    testParser.on(TestType.class, (testDefinition: TestDefinition) => tests.push(testDefinition));
    testParser.on(TestType.method, (testDefinition: TestDefinition) => tests.push(testDefinition));
    testParser.parse(buffer, file);

    return tests;
};

describe('PestParser', () => {
    const findTest = (tests: TestDefinition[], id: string) => {
        const lookup = {
            [TestType.method]: (test: TestDefinition) => test.methodName === id,
            [TestType.class]: (test: TestDefinition) => test.className === id && !test.methodName,
            [TestType.namespace]: (test: TestDefinition) => test.classFQN === id && !test.className && !test.methodName,
        } as { [key: string]: Function };

        for (const [, fn] of Object.entries(lookup)) {
            const test = tests.find((test: TestDefinition) => fn(test));

            if (test) {
                return test;
            }
        }

        return undefined;
    };

    const givenTest = (file: string, content: string, id: string) => {
        return findTest(parse(content, file), id);
    };

    const file = pestProject('tests/Fixtures/ExampleTest.php');

    it('namespace:Tests\\Fixtures', async () => {
        const content = `<?php 

test('example', function () {
    expect(true)->toBeTrue();
});
        `;

        expect(givenTest(file, content, 'P\\Tests\\Fixtures')).toEqual(expect.objectContaining({
            type: TestType.namespace,
            id: 'namespace:Tests\\Fixtures',
            classFQN: 'P\\Tests\\Fixtures',
            namespace: 'P\\Tests\\Fixtures',
            label: 'Tests\\Fixtures',
            depth: 1,
        }));
    });

    it('ExampleTest', async () => {
        const content = `<?php 

test('example', function () {
    expect(true)->toBeTrue();
})
`;
        expect(givenTest(file, content, 'ExampleTest')).toEqual(expect.objectContaining({
            type: TestType.class,
            id: 'Tests\\Fixtures\\ExampleTest',
            classFQN: 'P\\Tests\\Fixtures\\ExampleTest',
            namespace: 'P\\Tests\\Fixtures',
            className: 'ExampleTest',
            label: 'ExampleTest',
            file,
            start: { line: expect.any(Number), character: expect.any(Number) },
            end: { line: expect.any(Number), character: expect.any(Number) },
            depth: 2,
        }));
    });

    it('example', async () => {
        const content = `<?php 

test('example', function () {
    expect(true)->toBeTrue();
});
        `;

        expect(givenTest(file, content, 'example')).toEqual({
            type: TestType.method,
            id: 'tests/Fixtures/ExampleTest.php::example',
            classFQN: 'P\\Tests\\Fixtures\\ExampleTest',
            namespace: 'P\\Tests\\Fixtures',
            className: 'ExampleTest',
            methodName: 'example',
            label: 'example',
            file,
            start: { line: expect.any(Number), character: expect.any(Number) },
            end: { line: expect.any(Number), character: expect.any(Number) },
            depth: 3,
        });
    });

    it('it test example', async () => {
        const content = `<?php

it('test example', function () {
    expect(true)->toBeTrue();
});
        `;

        expect(givenTest(file, content, 'it test example')).toEqual({
            type: TestType.method,
            id: 'tests/Fixtures/ExampleTest.php::it test example',
            classFQN: 'P\\Tests\\Fixtures\\ExampleTest',
            namespace: 'P\\Tests\\Fixtures',
            className: 'ExampleTest',
            methodName: 'it test example',
            label: 'it test example',
            file,
            start: { line: expect.any(Number), character: expect.any(Number) },
            end: { line: expect.any(Number), character: expect.any(Number) },
            depth: 3,
        });
    });

    it('`something` → example', async () => {
        const content = `<?php

describe('something', function () {
    test('example', function () {
        expect(true)->toBeTrue();
    });
});
        `;
        expect(givenTest(file, content, '`something` → example')).toEqual({
            type: TestType.method,
            id: 'tests/Fixtures/ExampleTest.php::`something` → example',
            classFQN: 'P\\Tests\\Fixtures\\ExampleTest',
            namespace: 'P\\Tests\\Fixtures',
            className: 'ExampleTest',
            methodName: '`something` → example',
            label: 'something → example',
            file,
            start: { line: expect.any(Number), character: expect.any(Number) },
            end: { line: expect.any(Number), character: expect.any(Number) },
            depth: 3,
        });
    });

    it('arrow function `something` → it example', async () => {
        const content = `<?php
        
describe('something', fn () => it('example', expect(true)->toBeTrue()));

        `;

        expect(givenTest(file, content, '`something` → it example')).toEqual({
            type: TestType.method,
            id: 'tests/Fixtures/ExampleTest.php::`something` → it example',
            classFQN: 'P\\Tests\\Fixtures\\ExampleTest',
            namespace: 'P\\Tests\\Fixtures',
            className: 'ExampleTest',
            methodName: '`something` → it example',
            label: 'something → it example',
            file,
            start: { line: expect.any(Number), character: expect.any(Number) },
            end: { line: expect.any(Number), character: expect.any(Number) },
            depth: 3,
        });
    });

    it('`something` → `something else` → it test example', async () => {
        const content = `<?php

describe('something', function () {
    describe('something else', function () {
        it('test example', function () {
            expect(true)->toBeTrue();
        });
    });
}); 
        `;

        expect(givenTest(file, content, '`something` → `something else` → it test example')).toEqual({
            type: TestType.method,
            id: 'tests/Fixtures/ExampleTest.php::`something` → `something else` → it test example',
            classFQN: 'P\\Tests\\Fixtures\\ExampleTest',
            namespace: 'P\\Tests\\Fixtures',
            className: 'ExampleTest',
            methodName: '`something` → `something else` → it test example',
            label: 'something → something else → it test example',
            file,
            start: { line: expect.any(Number), character: expect.any(Number) },
            end: { line: expect.any(Number), character: expect.any(Number) },
            depth: 3,
        });
    });

    it('it example 2', () => {
        const content = `<?php

it('example 2')->assertTrue(true);
        `;

        expect(givenTest(file, content, 'it example 2')).toEqual({
            type: TestType.method,
            id: 'tests/Fixtures/ExampleTest.php::it example 2',
            classFQN: 'P\\Tests\\Fixtures\\ExampleTest',
            namespace: 'P\\Tests\\Fixtures',
            className: 'ExampleTest',
            methodName: 'it example 2',
            label: 'it example 2',
            file,
            start: { line: expect.any(Number), character: expect.any(Number) },
            end: { line: expect.any(Number), character: expect.any(Number) },
            depth: 3,
        });
    });

    it('not test or test', async () => {
        const content = `<?php 

function hello(string $description,  callable $closure) {}

hello('hello', function () {
    expect(true)->toBeTrue();
});
        `;

        expect(givenTest(file, content, 'hello')).toBeUndefined();
    });
});