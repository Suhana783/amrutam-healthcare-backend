const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/auth.routes");
const availabilityRoutes = require("./routes/availability.routes");
const doctorRoutes = require("./routes/doctor.routes");
const consultationRoutes = require("./routes/consultation.routes");
const prescriptionRoutes = require("./routes/prescription.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Amrutam Healthcare API is running",
  });
});

module.exports = app;
