# SmartHire Frontend

A modern, AI-powered resume matching platform built with React. SmartHire helps recruiters and job seekers find the perfect matches using advanced AI technology.

## 🚀 Features

### For Job Seekers
- **Resume Upload**: Upload PDF resumes with instant parsing
- **AI-Powered Matching**: Get intelligent job recommendations based on skills, experience, and education
- **Profile Display**: View parsed resume information in a clean, organized format
- **Match Scoring**: See detailed match scores with breakdowns for skills, experience, and education

### For Recruiters
- **Dashboard Management**: Comprehensive dashboard to manage all candidates
- **Candidate Profiles**: Detailed view of candidate information and job matches
- **Status Management**: Shortlist, reject, or mark candidates as under review
- **Export Functionality**: Export candidate data to CSV or PDF
- **Search & Filter**: Advanced search and filtering capabilities
- **Real-time Updates**: Auto-polling for live dashboard updates

### Technical Features
- **Modern UI/UX**: Glass morphism design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **PWA Support**: Progressive Web App with offline capabilities
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance Optimized**: Fast loading with optimized assets

## 🛠️ Tech Stack

- **React 19.1.0** - Modern React with hooks and functional components
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API communication
- **jsPDF** - PDF generation for exports
- **CSS3** - Custom styling with glass morphism effects
- **PWA** - Progressive Web App capabilities

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smarthire-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

### Backend Integration
Ensure the Flask backend is running on `http://localhost:5000` with the following endpoints:

- `POST /parse_resume` - Parse uploaded resume
- `POST /match_jobs` - Match candidate with jobs
- `GET /resume_matches` - Get all resume matches
- `POST /update_status` - Update candidate status

## 📱 Usage

### For Job Seekers
1. **Upload Resume**: Click "Choose Resume File" and select your PDF resume
2. **View Profile**: Review the parsed information from your resume
3. **See Matches**: View AI-powered job recommendations with match scores
4. **Job Posting**: Access the job posting form to create new job listings

### For Recruiters
1. **Access Dashboard**: Click "Recruiter Dashboard" to view all candidates
2. **Search & Filter**: Use the search bar and filters to find specific candidates
3. **Review Profiles**: Click the eye icon to view detailed candidate information
4. **Manage Status**: Use the action buttons to shortlist, reject, or review candidates
5. **Export Data**: Download candidate data in CSV or PDF format

## 🎨 Design System

### Color Palette
- **Primary**: `#3b82f6` (Blue)
- **Secondary**: `#8b5cf6` (Purple)
- **Success**: `#16a34a` (Green)
- **Warning**: `#d97706` (Orange)
- **Error**: `#dc2626` (Red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Glass Cards**: Semi-transparent cards with backdrop blur
- **Gradient Icons**: Colorful icon containers with gradients
- **Animated Elements**: Smooth transitions and hover effects
- **Responsive Grid**: Flexible layouts for all screen sizes

## 📊 Performance

### Optimizations
- **Code Splitting**: Automatic code splitting with React Router
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized images and icons
- **Caching**: Service worker for offline functionality
- **Bundle Optimization**: Minimized and compressed assets

### Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Security

### Features
- **Input Validation**: Client-side validation for all forms
- **XSS Protection**: Sanitized user inputs
- **CORS Handling**: Proper cross-origin request handling
- **Error Boundaries**: Graceful error handling without data exposure

## 🧪 Testing

### Available Scripts
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user flow testing

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

### Deployment Options
1. **Netlify**: Drag and drop the `build` folder
2. **Vercel**: Connect your repository for automatic deployments
3. **AWS S3**: Upload build files to S3 bucket
4. **Docker**: Use the provided Dockerfile

### Environment Setup
```bash
# Production environment
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style
- Use functional components with hooks
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
1. **CORS Errors**: Ensure backend CORS is properly configured
2. **API Connection**: Verify backend server is running on correct port
3. **File Upload**: Check file size limits and supported formats

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release with core functionality
- Resume parsing and job matching
- Recruiter dashboard
- PWA support
- Modern UI/UX design

---

**Built with ❤️ by the SmartHire Team**
