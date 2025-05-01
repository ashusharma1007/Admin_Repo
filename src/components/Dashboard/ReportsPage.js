import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Button,
  useTheme,
  Skeleton
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  Print as PrintIcon
} from '@mui/icons-material';

// Mock data for dashboard
const voterTrendData = [
  { month: 'Jan', registrations: 400, verifications: 240 },
  { month: 'Feb', registrations: 300, verifications: 139 },
  { month: 'Mar', registrations: 200, verifications: 980 },
  { month: 'Apr', registrations: 278, verifications: 390 },
  { month: 'May', registrations: 189, verifications: 480 },
  { month: 'Jun', registrations: 239, verifications: 380 },
  { month: 'Jul', registrations: 349, verifications: 430 },
  { month: 'Aug', registrations: 180, verifications: 290 },
  { month: 'Sep', registrations: 420, verifications: 380 },
  { month: 'Oct', registrations: 510, verifications: 460 }
];

const ageDistributionData = [
  { name: '18-25', value: 2400 },
  { name: '26-40', value: 4567 },
  { name: '41-60', value: 1398 },
  { name: '60+', value: 980 }
];

const genderDistributionData = [
  { name: 'Male', value: 4300 },
  { name: 'Female', value: 3908 },
  { name: 'Other', value: 147 }
];

const pollingStationData = [
  { name: 'Station 1', voters: 4000 },
  { name: 'Station 2', voters: 3000 },
  { name: 'Station 3', voters: 2000 },
  { name: 'Station 4', voters: 2780 },
  { name: 'Station 5', voters: 1890 },
  { name: 'Station 6', voters: 2390 },
];

const electionTurnoutData = [
  { year: '2010', turnout: 65 },
  { year: '2012', turnout: 59 },
  { year: '2014', turnout: 80 },
  { year: '2016', turnout: 81 },
  { year: '2018', turnout: 56 },
  { year: '2020', turnout: 75 },
  { year: '2022', turnout: 82 },
];

const voterCategoriesData = [
  { category: 'General', count: 4300 },
  { category: 'SC', count: 1200 },
  { category: 'ST', count: 980 },
  { category: 'OBC', count: 2700 },
  { category: 'EWS', count: 1500 },
];

// Mock configuration data
const states = [
  { value: 'all', label: 'All States' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Maharashtra', label: 'Maharashtra' }
];

const districts = [
  { value: 'all', label: 'All Districts' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Mysore', label: 'Mysore' },
  { value: 'Patna', label: 'Patna' },
  { value: 'Mumbai', label: 'Mumbai' }
];

const assemblyConstituencies = [
  { value: 'all', label: 'All Constituencies' },
  { value: 'Jayanagar', label: 'Jayanagar' },
  { value: 'Padmanabhanagar', label: 'Padmanabhanagar' },
  { value: 'Patna Sahib', label: 'Patna Sahib' }
];

const ReportsPage = () => {
  const theme = useTheme();
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedConstituency, setSelectedConstituency] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const RADIAN = Math.PI / 180;

  useEffect(() => {
    // Simulate loading time for data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    // Reset district and constituency when state changes
    setSelectedDistrict('all');
    setSelectedConstituency('all');
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    // Reset constituency when district changes
    setSelectedConstituency('all');
  };

  const handleConstituencyChange = (event) => {
    setSelectedConstituency(event.target.value);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert('Report export functionality would be implemented here');
  };

  // Custom pie chart label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: '#333' }}>
          Electoral Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ textTransform: 'none' }}
          >
            Print
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ textTransform: 'none' }}
          >
            Export
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ textTransform: 'none' }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterListIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>
            Filters
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="state-select-label">State</InputLabel>
              <Select
                labelId="state-select-label"
                id="state-select"
                value={selectedState}
                label="State"
                onChange={handleStateChange}
              >
                {states.map(state => (
                  <MenuItem key={state.value} value={state.value}>{state.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="district-select-label">District</InputLabel>
              <Select
                labelId="district-select-label"
                id="district-select"
                value={selectedDistrict}
                label="District"
                onChange={handleDistrictChange}
                disabled={selectedState === 'all'}
              >
                {districts.map(district => (
                  <MenuItem key={district.value} value={district.value}>{district.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="constituency-select-label">Assembly Constituency</InputLabel>
              <Select
                labelId="constituency-select-label"
                id="constituency-select"
                value={selectedConstituency}
                label="Assembly Constituency"
                onChange={handleConstituencyChange}
                disabled={selectedDistrict === 'all'}
              >
                {assemblyConstituencies.map(constituency => (
                  <MenuItem key={constituency.value} value={constituency.value}>{constituency.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Registered Voters
              </Typography>
              {loading ? (
                <Skeleton variant="text" width="70%" height={40} />
              ) : (
                <Typography variant="h4" component="div" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                  8,345,921
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Last updated: Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                New Registrations (This Month)
              </Typography>
              {loading ? (
                <Skeleton variant="text" width="70%" height={40} />
              ) : (
                <Typography variant="h4" component="div" sx={{ fontWeight: 500, color: theme.palette.success.main }}>
                  12,847
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                ↑ 8.3% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Polling Stations
              </Typography>
              {loading ? (
                <Skeleton variant="text" width="70%" height={40} />
              ) : (
                <Typography variant="h4" component="div" sx={{ fontWeight: 500, color: theme.palette.info.main }}>
                  5,283
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Across 234 districts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Average Turnout (Last Election)
              </Typography>
              {loading ? (
                <Skeleton variant="text" width="70%" height={40} />
              ) : (
                <Typography variant="h4" component="div" sx={{ fontWeight: 500, color: theme.palette.warning.main }}>
                  67.2%
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                ↑ 3.1% from previous election
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different report types */}
      <Paper sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChangeTab} 
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Voter Demographics" sx={{ textTransform: 'none' }} />
          <Tab label="Turnout Analysis" sx={{ textTransform: 'none' }} />
          <Tab label="Polling Stations" sx={{ textTransform: 'none' }} />
          <Tab label="Registration Trends" sx={{ textTransform: 'none' }} />
        </Tabs>

        {/* Demographics Tab Content */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Voter Demographics
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Analysis of voter distribution by age, gender, and category
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Age Distribution
                </Typography>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ageDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ageDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Gender Distribution
                </Typography>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Voter Categories
                </Typography>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={voterCategoriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                      <Legend />
                      <Bar dataKey="count" name="Number of Voters" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Turnout Analysis Tab Content */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Turnout Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Historical voter turnout data across multiple elections
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Historical Turnout Percentage
                </Typography>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={400} />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={electionTurnoutData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Area type="monotone" dataKey="turnout" name="Voter Turnout %" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Polling Stations Tab Content */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Polling Stations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Distribution of voters across polling stations
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Voters by Polling Station
                </Typography>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={400} />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={pollingStationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                      <Legend />
                      <Bar dataKey="voters" name="Number of Voters" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Registration Trends Tab Content */}
        {tabValue === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Registration Trends
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Monthly voter registration and verification trends
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Voter Registration & Verification Trends
                </Typography>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={400} />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={voterTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="registrations" name="New Registrations" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="verifications" name="Verifications Completed" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ReportsPage;