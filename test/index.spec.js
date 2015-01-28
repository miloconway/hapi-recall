/*jslint node: true */
'use strict';

var Lab = require('lab');
var chai = require('chai');
var expect = chai.expect;

var lab = module.exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;

describe('hapiRecall', function () {
    var hapiRecall = require('../index');

    it('should throw on empty path', function (done) {
        var testPath = '';
        var testQuery = {};

        function recallEmpty() {
            hapiRecall(testPath, testQuery);
        }

        expect(recallEmpty).to.throw('path must not be empty');

        done();
    });

    it('should handle base path', function (done) {
        var testPath = '/';
        var testQuery = {};

        expect(hapiRecall(testPath, testQuery))
            .to.equal('/');

        done();
    });

    it('should handle missing query', function (done) {
        var testPath = '/';

        expect(hapiRecall(testPath))
            .to.equal('/');

        done();
    });

    it('should throw if missing mandatory param', function (done) {
        var testPath = '/{foo}';
        var testQuery = {
            foo: null
        };

        function recallMissing() {
            hapiRecall(testPath, testQuery);
        }

        expect(recallMissing).to.throw(/must be defined/);

        done();
    });

    it('should handle mandatory path with param', function (done) {
        var testPath = '/{foo}';
        var testQuery = {
            foo: 'bar'
        };

        expect(hapiRecall(testPath, testQuery))
            .to.equal('/bar');

        done();
    });

    it('should handle path with missing optional param', function (done) {
        var testPath = '/{foo?}';
        var testQuery = {
            foo: null
        };

        expect(hapiRecall(testPath, testQuery))
            .to.equal('/');

        done();
    });

    it('should handle path with provided optional param', function (done) {
        var testPath = '/{foo?}';
        var testQuery = {
            foo: 'baz'
        };

        expect(hapiRecall(testPath, testQuery))
            .to.equal('/baz');

        done();
    });

    it('should handle path with literals', function (done) {
        var testPath = '/buzz/a{foo}.jpg';
        var testQuery = {
            foo: 'bar'
        };

        expect(hapiRecall(testPath, testQuery))
            .to.equal('/buzz/abar.jpg');

        testPath = '/buzz/{foo}.png';

        expect(hapiRecall(testPath, testQuery))
            .to.equal('/buzz/bar.png');

        testPath = '/buzz/xyz-{foo}';

        expect(hapiRecall(testPath, testQuery))
            .to.equal('/buzz/xyz-bar');

        done();
    });

    it('should handle path with bounded multi-segments', function (done) {
        var testPath = '/buzz/{foo*2}/{acti}';
        var testQuery = {
            foo: 'bar/baz',
            acti: 'bacti'
        };

        expect(hapiRecall(testPath, testQuery))
            .to.equal('/buzz/bar/baz/bacti');

        done();
    });

    it('should throw on bounded segments with part too short', function (done) {
        var testPath = '/buzz/{foo*2}';
        var testQuery = {
            foo: 'bar'
        };

        function recallTooShort() {
            hapiRecall(testPath, testQuery);
        }

        expect(recallTooShort).to.throw(/does not have enough segments/);

        done();
    });

    it('should handle path with unbounded multi-segments', function (done) {
        var testPath = '/buzz/{foo*}';
        var testQuery = {
            foo: 'bar1/bar2/bar3'
        };

        expect(hapiRecall(testPath, testQuery))
            .to.equal('/buzz/bar1/bar2/bar3');

        done();
    });
});
