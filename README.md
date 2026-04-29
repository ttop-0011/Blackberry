# Permit Tracking System

A modern, web-based permit tracking system designed to manage and monitor building permits efficiently.

## Features

✨ **Core Functionality**
- **Add Permits**: Create new permit records with comprehensive information
- **Search & Filter**: Find permits quickly by number, project name, or status
- **Status Tracking**: Track permits through multiple states (Pending, Approved, In Progress, Completed, Rejected)
- **Expiration Alerts**: Automatic detection of expired permits
- **Statistics Dashboard**: Real-time overview of permit statistics
- **Edit & Delete**: Modify or remove permits as needed
- **Local Storage**: Persist permit data in browser storage

## Supported Permit Types

- Building Permit
- Electrical Permit
- Plumbing Permit
- Mechanical Permit
- Demolition Permit
- Other

## Status Types

- 🟡 **Pending** - Awaiting approval
- 🟢 **Approved** - Approved and ready to proceed
- 🔵 **In Progress** - Currently active
- ✅ **Completed** - Work finished
- ❌ **Rejected** - Application rejected

## Getting Started

### Installation

1. Clone or navigate to this repository
2. Open `index.html` in a web browser
3. No additional dependencies or server setup required

### Usage

1. **Add a New Permit**
   - Fill out the form with permit details
   - Click "Add Permit" to save

2. **Search for Permits**
   - Use the search box to find permits by number or project name
   - Filter by status using the dropdown
   - Click "Clear Filters" to reset

3. **Manage Permits**
   - Edit: Click the "Edit" button to modify a permit (it will populate the form)
   - Delete: Click the "Delete" button to remove a permit

4. **View Statistics**
   - See real-time counts of total permits, status breakdowns, and expired permits

## Data Storage

The system uses the browser's **localStorage** to persist permit data. Data is stored locally on your device and is not sent to any server.

### Local Storage
- Data persists across browser sessions
- Clear browser data to reset the system
- No backup is created automatically

## Technical Stack

- **HTML5**: Semantic markup and form elements
- **CSS3**: Responsive design with modern styling
- **Vanilla JavaScript**: No external dependencies
- **LocalStorage API**: Client-side data persistence

## File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # JavaScript logic and functionality
└── README.md       # This file
```

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

The system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Features Highlights

### Smart Status Badges
Each permit displays its status with color-coded badges for quick visual identification.

### Expiration Warnings
Permits nearing or past their expiration date are clearly marked with a ⚠️ warning.

### Real-time Statistics
The dashboard automatically updates counts as you add, edit, or delete permits.

### Keyboard Friendly
Navigate and interact with the system using keyboard controls.

## Security Notes

- Data is stored locally in your browser
- No data is transmitted to external servers
- Sensitive information should not be stored without additional encryption
- Clear browser data to completely remove stored permits

## Future Enhancements

Potential features for future versions:
- Export permits to PDF/CSV
- Print permit reports
- Calendar view for expiration dates
- Permit renewal reminders
- Multi-user support with cloud sync
- Advanced filtering and sorting
- Photo/document attachments
- Email notifications
- Integration with government permit systems

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Made with ❤️ for efficient permit management**
