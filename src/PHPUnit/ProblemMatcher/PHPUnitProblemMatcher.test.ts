import { TestResultEvent } from '.';
import { phpUnitProject, phpUnitProjectWin } from '../__tests__/utils';
import { ProblemMatcher } from './ProblemMatcher';

const problemMatcher = new ProblemMatcher();

describe('PHPUnit ProblemMatcher Text', () => {
    const resultShouldBe = (content: string, expected: any) => {
        const actual = problemMatcher.parse(content);

        if (expected === undefined) {
            expect(actual).toBeUndefined();
        } else {
            expect(actual).toEqual(expect.objectContaining(expected));
        }
    };

    describe('Teamcity Life Cycle', () => {
        it('PHPUnit version', () => {
            resultShouldBe('PHPUnit 9.5.25 #StandWithUkraine', {
                event: TestResultEvent.testVersion,
                phpunit: '9.5.25',
                text: `PHPUnit 9.5.25 #StandWithUkraine`,
            });
        });

        it('Runtime', () => {
            resultShouldBe('Runtime:       PHP 8.1.12', {
                event: TestResultEvent.testRuntime,
                runtime: 'PHP 8.1.12',
                text: 'Runtime:       PHP 8.1.12',
            });
        });

        it('Configuration', () => {
            resultShouldBe(`Configuration: ${phpUnitProject('phpunit.xml')}`, {
                event: TestResultEvent.testConfiguration,
                configuration: phpUnitProject('phpunit.xml'),
                text: `Configuration: ${phpUnitProject('phpunit.xml')}`,
            });
        });

        it('testSuiteStarted default', () => {
            resultShouldBe(`##teamcity[testSuiteStarted name='default' flowId='8024']`, {
                event: TestResultEvent.testSuiteStarted,
                name: 'default',
                flowId: 8024,
            });
        });

        it('testCount', () => {
            resultShouldBe(`##teamcity[testCount count='19' flowId='8024']`, {
                event: TestResultEvent.testCount,
                count: 19,
                flowId: 8024,
            });
        });

        it('testSuiteStarted Recca0120\\VSCode\\Tests\\AssertionsTest', () => {
            resultShouldBe(`##teamcity[testSuiteStarted name='Recca0120\\VSCode\\Tests\\AssertionsTest' locationHint='php_qn://${phpUnitProjectWin('tests/AssertionsTest.php')}::\\Recca0120\\VSCode\\Tests\\AssertionsTest' flowId='8024']`, {
                event: TestResultEvent.testSuiteStarted,
                id: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)',
                testId: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)',
                flowId: 8024,
            });
        });

        it('testStarted passed', () => {
            resultShouldBe(`##teamcity[testStarted name='test_passed' locationHint='php_qn://${phpUnitProjectWin('tests/AssertionsTest.php')}::\\Recca0120\\VSCode\\Tests\\AssertionsTest::test_passed' flowId='8024']`, {
                event: TestResultEvent.testStarted,
                id: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Passed',
                testId: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Passed',
                flowId: 8024,
            });
        });

        it('testFinished', () => {
            resultShouldBe(`##teamcity[testFinished name='test_passed' duration='0' flowId='8024']`, {
                event: TestResultEvent.testFinished,
                id: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Passed',
                testId: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Passed',
                flowId: 8024,
            });
        });

        it('testStarted failed', () => {
            resultShouldBe(`##teamcity[testStarted name='test_is_not_same' locationHint='php_qn://${phpUnitProjectWin('tests/AssertionsTest.php')}::\\Recca0120\\VSCode\\Tests\\AssertionsTest::test_is_not_same' flowId='8024']`, {
                event: TestResultEvent.testStarted,
                id: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Is not same',
                testId: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Is not same',
                flowId: 8024,
            });
        });

        it('testFailed', () => {
            resultShouldBe(`##teamcity[testFailed name='test_is_not_same' message='Failed asserting that two arrays are identical.' details=' ${phpUnitProjectWin('tests\\AssertionsTest.php')}:27|n ' duration='0' type='comparisonFailure' actual='Array &0 (|n    |'e|' => |'f|'|n    0 => |'g|'|n    1 => |'h|'|n)' expected='Array &0 (|n    |'a|' => |'b|'|n    |'c|' => |'d|'|n)' flowId='8024']`, undefined);
        });

        it('testFinished failed', () => {
            resultShouldBe(`##teamcity[testFinished name='test_is_not_same' duration='0' flowId='8024']`, {
                event: TestResultEvent.testFailed,
                id: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Is not same',
                testId: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Is not same',
                message: 'Failed asserting that two arrays are identical.',
                details: [
                    {
                        file: phpUnitProjectWin('tests/AssertionsTest.php'),
                        line: 27,
                    },
                ],
                duration: 0,
                type: 'comparisonFailure',
                actual: `Array &0 (\n    'e' => 'f'\n    0 => 'g'\n    1 => 'h'\n)`,
                expected: `Array &0 (\n    'a' => 'b'\n    'c' => 'd'\n)`,
                flowId: 8024,
            });
        });

        it('testSuiteStarted addition_provider', () => {
            resultShouldBe(`##teamcity[testSuiteStarted name='addition_provider' locationHint='php_qn://${phpUnitProjectWin('tests/AssertionsTest.php')}::\\Recca0120\\VSCode\\Tests\\AssertionsTest::addition_provider' flowId='8024']`, {
                event: TestResultEvent.testSuiteStarted,
                id: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Addition provider',
                testId: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Addition provider',
                file: phpUnitProjectWin('tests/AssertionsTest.php'),
                locationHint: `php_qn://${phpUnitProjectWin('tests/AssertionsTest.php')}::\\Recca0120\\VSCode\\Tests\\AssertionsTest::addition_provider`,
                flowId: 8024,
            });
        });

        it('testStarted addition_provider', () => {
            resultShouldBe(`##teamcity[testStarted name='addition_provider with data set #2' locationHint='php_qn://${phpUnitProjectWin('tests/AssertionsTest.php')}::\\Recca0120\\VSCode\\Tests\\AssertionsTest::addition_provider with data set #2' flowId='8024']`, {
                event: TestResultEvent.testStarted,
                id: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Addition provider with data set #2',
                testId: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Addition provider',
                file: phpUnitProjectWin('tests/AssertionsTest.php'),
                locationHint: `php_qn://${phpUnitProjectWin('tests/AssertionsTest.php')}::\\Recca0120\\VSCode\\Tests\\AssertionsTest::addition_provider with data set #2`,
                flowId: 8024,
            });
        });

        it('testFailed addition_provider with failed', () => {
            resultShouldBe(`##teamcity[testFailed name='addition_provider with data set #2' message='Failed asserting that 1 matches expected 2.' details=' ${phpUnitProjectWin('tests/AssertionsTest.php')}:60|n ' duration='0' type='comparisonFailure' actual='1' expected='2' flowId='8024']`, undefined);

            resultShouldBe(`##teamcity[testFinished name='addition_provider with data set #2' duration='0' flowId='8024']`, {
                event: TestResultEvent.testFailed,
                id: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Addition provider with data set #2',
                testId: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)::Addition provider',
                file: phpUnitProjectWin('tests/AssertionsTest.php'),
                locationHint: `php_qn://${phpUnitProjectWin('tests/AssertionsTest.php')}::\\Recca0120\\VSCode\\Tests\\AssertionsTest::addition_provider with data set #2`,
                message: 'Failed asserting that 1 matches expected 2.',
                details: [
                    {
                        file: phpUnitProjectWin('tests/AssertionsTest.php'),
                        line: 60,
                    },
                ],
                type: 'comparisonFailure',
                actual: '1',
                expected: '2',
                duration: 0,
                flowId: 8024,
            });
        });

        it('testSuiteFinished Recca0120\\VSCode\\Tests\\AssertionsTest', () => {
            resultShouldBe(`##teamcity[testSuiteFinished name='Recca0120\\VSCode\\Tests\\AssertionsTest' flowId='8024']`, {
                event: TestResultEvent.testSuiteFinished,
                id: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)',
                testId: 'Assertions (Recca0120\\VSCode\\Tests\\Assertions)',
                flowId: 8024,
            });
        });

        it('testSuiteFinished default', () => {
            resultShouldBe(`##teamcity[testSuiteFinished name='default' flowId='8024']`, {
                event: TestResultEvent.testSuiteFinished,
                name: 'default',
                flowId: 8024,
            });
        });

        it('TestCount', () => {
            resultShouldBe(`##teamcity[testCount count='19' flowId='8024']`, {
                event: TestResultEvent.testCount,
                count: 19,
                flowId: 8024,
            });
        });

        it('TestSummary', () => {
            resultShouldBe('Tests: 19, Assertions: 15, Errors: 2, Failures: 4, Skipped: 1, Incomplete: 1, Risky: 2.', {
                tests: 19,
                assertions: 15,
                errors: 2,
                failures: 4,
                skipped: 1,
                incomplete: 1,
                risky: 2,
            });
        });

        it('empty line', () => {
            resultShouldBe('', undefined);
        });
    });

    it('testFailed test_throw_exception', () => {
        const contents = [
            `##teamcity[testStarted name='test_throw_exception' locationHint='php_qn://${phpUnitProject('tests/CalculatorTest.php')}::\\Recca0120\\VSCode\\Tests\\CalculatorTest::test_throw_exception' flowId='28756']`,
            `##teamcity[testFailed name='test_throw_exception' message='Exception' details='${phpUnitProject('src/Calculator.php')}:21|n${phpUnitProject('tests/CalculatorTest.php')}:54|n' duration='0' flowId='28756']`,
            `##teamcity[testFailed name='test_throw_exception' message='This test did not perform any assertions' details='' duration='15' flowId='28756']`,
            `##teamcity[testFinished name='test_throw_exception' duration='15' flowId='28756']`,
        ];

        let result;
        for (const content of contents) {
            result = problemMatcher.parse(content);
        }

        expect(result).toEqual(
            expect.objectContaining({
                event: TestResultEvent.testFailed,
                name: 'test_throw_exception',
                locationHint: `php_qn://${phpUnitProject('tests/CalculatorTest.php')}::\\Recca0120\\VSCode\\Tests\\CalculatorTest::test_throw_exception`,
                flowId: 28756,
                id: 'Calculator (Recca0120\\VSCode\\Tests\\Calculator)::Throw exception',
                testId: 'Calculator (Recca0120\\VSCode\\Tests\\Calculator)::Throw exception',
                file: phpUnitProject('tests/CalculatorTest.php'),
                message: 'Exception\n\nThis test did not perform any assertions',
                details: [
                    {
                        file: phpUnitProject('src/Calculator.php'),
                        line: 21,
                    },
                    {
                        file: phpUnitProject('tests/CalculatorTest.php'),
                        line: 54,
                    },
                ],
                duration: 15,
            }),
        );
    });
});