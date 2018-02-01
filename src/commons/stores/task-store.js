(function() {
    "use strict";

    angular
        .module("TendrlModule")
        .service("taskStore", taskStore);

    /*@ngInject*/
    function taskStore($state, $q, utils) {
        var store = this;

        store.getJobList = function(clusterId) {
            var list,
                deferred;

            deferred = $q.defer();
            utils.getJobList(clusterId)
                .then(function(data) {
                    list = _setUpdatedDate(data);
                    deferred.resolve(list);
                });
            return deferred.promise;

            function _setUpdatedDate(data) {
                var len,
                    temp,
                    i;
                len = data.length;
                
                for (i = 0; i < len; i++) {
                    temp = new Date(data[i].updated_at);
                    data[i].updated_at = temp;
                }

                return data;
            }
        };



        store.getJobDetail = function(jobId) {
            var deferred = $q.defer();

            utils.getJobDetail(jobId)
                .then(function(data) {
                    deferred.resolve(data);
                });

            return deferred.promise;
        };

        store.getTaskLogs = function(jobId) {
            var logs,
                deferred;

            deferred = $q.defer();
            utils.getTaskLogs(jobId)
                .then(function(data) {
                    if (data) {
                        logs = _formatData(data);
                    }
                    deferred.resolve(logs);
                });

            function _formatData(messages) {
                var msgs = [],
                    msg,
                    i,
                    len = messages.length;

                for (i = 0; i < len; i++) {
                    msg = {};
                    msg.type = messages[i].priority;
                    msg.message = messages[i].payload.message;
                    msg.date = messages[i].timestamp;
                    msgs.push(msg);
                }

                return msgs;
            }

            return deferred.promise;
        };

        store.getTaskStatus = function(jobId) {
            var deferred = $q.defer();

            utils.getTaskStatus(jobId)
                .then(function(data) {
                    deferred.resolve(data);
                });

            return deferred.promise;
        };

        store.getTaskOutput = function(jobId) {
            var deferred = $q.defer(),
                journal_details = [];

            utils.getTaskOutput(jobId)
                .then(function(data) {
                    _updateJournalData(data);
                    deferred.resolve(journal_details);
                });

            return deferred.promise;

            function _updateJournalData(data) {
                var keys = Object.keys(data[0].GenerateJournalMapping),
                    len = keys.length,
                    temp = {},
                    i;

                for (i = 0; i < len; i++) {
                    temp = {};
                    temp.node_id = keys[i];
                    temp.storage_disks = data[0].GenerateJournalMapping[keys[i]].storage_disks;
                    temp.unallocated_disks = data[0].GenerateJournalMapping[keys[i]].unallocated_disks ? data[0].GenerateJournalMapping[keys[i]].unallocated_disks : [];
                    journal_details.push(temp);
                }
            }
        };
    }

})();