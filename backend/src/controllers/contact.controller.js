
const Contact = require("../models/Contact");

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required.",
      });
    }

    const newContact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      subject: subject.trim(),
      message: message.trim(),
      status: "unread",
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
      data: newContact,
    });
  } catch (error) {
    console.error("Create contact error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message. Please try again.",
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      messages: contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact messages.",
    });
  }
};

// @desc    Update message status
// @route   PATCH /api/contact/:id
// @access  Admin
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["unread", "read", "replied"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message status.",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message status updated.",
      data: contact,
    });
  } catch (error) {
    console.error("Update contact error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update message status.",
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete message.",
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
};
