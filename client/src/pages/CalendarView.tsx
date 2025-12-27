import { useState } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CalendarEvent {
  id: string;
  equipment: string;
  subject: string;
  type: 'preventive' | 'corrective';
  scheduledDate: string;
  scheduledTime: string;
  technician: string;
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 27)); // December 27, 2024

  // Mock preventive maintenance events
  const events: CalendarEvent[] = [
    {
      id: 'REQ-2025-010',
      equipment: 'Generator #1',
      subject: 'Monthly inspection',
      type: 'preventive',
      scheduledDate: '2024-12-28',
      scheduledTime: '09:00',
      technician: 'John Doe',
    },
    {
      id: 'REQ-2025-011',
      equipment: 'HVAC System',
      subject: 'Filter replacement',
      type: 'preventive',
      scheduledDate: '2024-12-29',
      scheduledTime: '14:00',
      technician: 'Mike Johnson',
    },
    {
      id: 'REQ-2025-012',
      equipment: 'Fire Suppression',
      subject: 'Quarterly check',
      type: 'preventive',
      scheduledDate: '2024-12-30',
      scheduledTime: '10:30',
      technician: 'Sarah Wilson',
    },
    {
      id: 'REQ-2025-013',
      equipment: 'CNC Machine #5',
      subject: 'Lubrication service',
      type: 'preventive',
      scheduledDate: '2025-01-02',
      scheduledTime: '08:00',
      technician: 'Tom Brown',
    },
    {
      id: 'REQ-2025-014',
      equipment: 'Forklift #12',
      subject: 'Safety inspection',
      type: 'preventive',
      scheduledDate: '2025-01-05',
      scheduledTime: '11:00',
      technician: 'Jane Smith',
    },
    {
      id: 'REQ-2025-015',
      equipment: 'Air Compressor',
      subject: 'Pressure test',
      type: 'preventive',
      scheduledDate: '2025-01-08',
      scheduledTime: '13:30',
      technician: 'Mike Johnson',
    },
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.scheduledDate === dateString);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule and view preventive maintenance</p>
        </div>
        <Button variant="primary" icon={<FiPlus />}>
          Schedule Maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const today = isToday(date);
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border rounded-lg transition-all ${
                        date
                          ? today
                            ? 'bg-blue-50 border-blue-300 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      {date && (
                        <>
                          {/* Date Number */}
                          <div className={`text-sm font-semibold mb-1 ${
                            today ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {date.getDate()}
                          </div>
                          
                          {/* Events */}
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium truncate hover:bg-green-200 transition-colors"
                                title={`${event.scheduledTime} - ${event.equipment}: ${event.subject}`}
                              >
                                {event.scheduledTime} {event.equipment}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="px-2 py-1 text-xs text-gray-600">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Events List - Takes 1 column */}
        <div>
          <Card title="Upcoming Maintenance">
            <div className="space-y-3">
              {events.slice(0, 8).map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-sm font-semibold text-green-600">
                        {new Date(event.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      {event.scheduledTime}
                    </Badge>
                  </div>

                  {/* Equipment */}
                  <p className="font-medium text-gray-900 mb-1">{event.equipment}</p>
                  
                  {/* Subject */}
                  <p className="text-sm text-gray-600 mb-2">{event.subject}</p>
                  
                  {/* Technician */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                      {event.technician.split(' ').map(n => n[0]).join('')}
                    </span>
                    <span>{event.technician}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Stats */}
          <Card title="This Month" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Scheduled</span>
                <span className="text-2xl font-bold text-gray-900">{events.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Week</span>
                <span className="text-2xl font-bold text-blue-600">
                  {events.filter(e => {
                    const eventDate = new Date(e.scheduledDate);
                    const today = new Date();
                    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return eventDate >= today && eventDate <= weekFromNow;
                  }).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Next 30 Days</span>
                <span className="text-2xl font-bold text-green-600">
                  {events.filter(e => {
                    const eventDate = new Date(e.scheduledDate);
                    const today = new Date();
                    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                    return eventDate >= today && eventDate <= monthFromNow;
                  }).length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
