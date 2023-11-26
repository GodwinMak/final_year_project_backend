const db = require("../models");
const { Op } = require('sequelize');
const moment = require('moment');

// creat main model
const Report = db.reports;

// main work

// 1. create and save new report

exports.createReport = async (req, res) => {
    try {
        const {report_name, longitude, latitude, report_description} = req.body;

        const report = await Report.create({
            report_name: report_name,
            longitude: longitude,
            latitude: latitude,
            report_description: report_description
        })
        res.status(200).send(report);
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
};

// 2. get all reports

exports.getAllReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // If startDate and endDate are not provided, calculate date range from the last added data or default to three months ago
        if (!startDate || !endDate) {
            // Find the latest date in your dataset
            const latestDateResult = await Report.findOne({
                order: [['create_At', 'DESC']]
            });

            let startMoment;
            if (latestDateResult && latestDateResult.create_At) {
                // Use the latest date to calculate the start date for three months ago
                startMoment = moment(latestDateResult.create_At).subtract(3, 'months');
            } else {
                // If no data exists, default to three months ago from the current date
                startMoment = moment().subtract(3, 'months');
            }

            startDate = startMoment.format('YYYY-MM-DD');
            endDate = moment().format('YYYY-MM-DD');
        }

        const whereClause = {
            create_At: {
                [Op.between]: [startDate, endDate]
            }
        };

        const reports = await Report.findAll({
            where: whereClause
        });

        res.status(200).send(reports);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 3. get report by id

exports.getReportById = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // If startDate and endDate are not provided, calculate date range from the last added data or default to three months ago
        if (!startDate || !endDate) {
            // Find the latest date in your dataset
            const latestDateResult = await Report.findOne({
                order: [['create_At', 'DESC']]
            });

            let startMoment;
            if (latestDateResult && latestDateResult.create_At) {
                // Use the latest date to calculate the start date for three months ago
                startMoment = moment(latestDateResult.create_At).subtract(3, 'months');
            } else {
                // If no data exists, default to three months ago from the current date
                startMoment = moment().subtract(3, 'months');
            }

            startDate = startMoment.format('YYYY-MM-DD');
            endDate = moment().format('YYYY-MM-DD');
        }

        // Retrieve the report by ID with date range filtering
        const report = await Report.findOne({
            where: {
                report_id: req.params.id,
                create_At: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        res.status(200).send(report);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 4. update report by id

exports.updateReportById = async (req, res) => {
    try {
        const report = await Report.update(req.body, {where: {report_id: req.params.id}});
        res.status(200).send({message: "Report updated successfully", report});
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
};

// 5. delete report by id

exports.deleteReportById = async (req, res) => {
    try {
        const report = await Report.destroy({where: {report_id: req.params.id}});
        res.status(200).send({message: "Report deleted successfully", report});
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
};