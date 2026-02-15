import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Tag,
  TrendingUp,
  Target,
  FileText,
  Star,
  ChevronRight,
  Award,
  Briefcase,
  Globe,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Loader from '@/components/Loader';
import PageHeader from '@/components/PageHeader';
import {
  useGetClientByIdQuery,
} from "@/api/sales/client.api";

const OldClientDetail = () => {
  const { id } = useParams();
  const { data: clientData, isFetching } = useGetClientByIdQuery(
    { id },
    { skip: !id }
  );

  const client = clientData?.data;
  const leadData = client?.leadData?.[0];

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <PageHeader title="Client Not Found" />
        <div className="bg-white rounded-lg shadow-sm p-8 text-center mt-6">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Not Found</h3>
          <p className="text-gray-600">The requested client details could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full font-medium";
    
    switch(status?.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'interested':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRatingBadge = (rating) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full font-medium";
    
    switch(rating?.toLowerCase()) {
      case 'high':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Client Details" />
      
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Client Overview Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Building className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                  <p className="text-gray-600">{client.companyName || 'Individual Client'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={getStatusBadge(client.status)}>
                      {client.status}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-sm text-gray-600">
                      Client ID: {client.clientId}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(client.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-600" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium text-gray-900">{client.phone}</div>
                  {client.altPhone && (
                    <div className="text-xs text-gray-500">Alt: {client.altPhone}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded">
                  <Mail className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{client.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded">
                  <MapPin className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium text-gray-900">{client.city}</div>
                  <div className="text-xs text-gray-500">{client.pincode}</div>
                </div>
              </div>

              {client.businessType && (
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded">
                    <Briefcase className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Business Type</div>
                    <div className="font-medium text-gray-900">{client.businessType}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Client Ratings */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-gray-600" />
              Client Assessment
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Revenue</div>
                <span className={getRatingBadge(client.revenue)}>
                  {client.revenue}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Satisfaction</div>
                <span className={getRatingBadge(client.satisfaction)}>
                  {client.satisfaction}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Repeat Potential</div>
                <span className={getRatingBadge(client.repeatPotential)}>
                  {client.repeatPotential}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Complexity</div>
                <span className={getRatingBadge(client.complexity)}>
                  {client.complexity}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Engagement</div>
                <span className={getRatingBadge(client.engagement)}>
                  {client.engagement}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500 mb-1">Attitude</div>
                <span className={getRatingBadge(client.positiveAttitude)}>
                  {client.positiveAttitude}
                </span>
              </div>
            </div>
          </div>

          {/* Address Section */}
          {client.address && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                Address Details
              </h2>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-700">{client.address}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  {client.city && <span>City: {client.city}</span>}
                  {client.state && <span>State: {client.state}</span>}
                  {client.pincode && <span>Pincode: {client.pincode}</span>}
                </div>
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-gray-600" />
              System Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded border ${client.isSentToManager ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Manager Review</div>
                    <div className="font-medium text-gray-900">
                      {client.isSentToManager ? 'Sent' : 'Pending'}
                    </div>
                  </div>
                  {client.isSentToManager ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              <div className={`p-4 rounded border ${client.isSentToProjectDepartment ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Project Department</div>
                    <div className="font-medium text-gray-900">
                      {client.isSentToProjectDepartment ? 'Sent' : 'Pending'}
                    </div>
                  </div>
                  {client.isSentToProjectDepartment ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              <div className={`p-4 rounded border ${client.isSentToRecceDepartment ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Recce Department</div>
                    <div className="font-medium text-gray-900">
                      {client.isSentToRecceDepartment ? 'Sent' : 'Pending'}
                    </div>
                  </div>
                  {client.isSentToRecceDepartment ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Information (if exists) */}
        {leadData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-600" />
                Lead Information
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Converted to Client)
                </span>
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Lead ID</div>
                  <div className="font-medium text-gray-900">{leadData.leadId}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Lead Source</div>
                  <div className="font-medium text-gray-900">{leadData.leadSource}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Lead Type</div>
                  <div className="font-medium text-gray-900">{leadData.leadType}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Lead Label</div>
                  <span className={getStatusBadge(leadData.leadLabel)}>
                    {leadData.leadLabel}
                  </span>
                </div>

                {leadData.expectedBusiness && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Expected Business</div>
                    <div className="font-medium text-gray-900">
                      ₹{parseInt(leadData.expectedBusiness).toLocaleString()}
                    </div>
                  </div>
                )}

                {leadData.requirement && (
                  <div className="lg:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">Requirement</div>
                    <div className="font-medium text-gray-900">{leadData.requirement}</div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-gray-500 mb-1">Lead By</div>
                  <div className="font-medium text-gray-900">
                    {leadData.leadBy?.name || 'N/A'}
                  </div>
                  {leadData.leadBy?.phone && (
                    <div className="text-xs text-gray-500">{leadData.leadBy.phone}</div>
                  )}
                </div>
              </div>

              {/* Status Timeline */}
              {leadData.statusTimeline && leadData.statusTimeline.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Status Timeline</h3>
                  <div className="space-y-4">
                    {leadData.statusTimeline.map((timeline, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          {index < leadData.statusTimeline.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="font-medium text-gray-900">{timeline.status}</div>
                            <div className="text-sm text-gray-500">
                              {formatDateTime(timeline.timestamp)}
                            </div>
                          </div>
                          {timeline.remark && (
                            <div className="text-sm text-gray-600 mt-1">{timeline.remark}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Created At</div>
              <div className="font-medium text-gray-900">
                {formatDateTime(client.createdAt)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Last Updated</div>
              <div className="font-medium text-gray-900">
                {formatDateTime(client.updatedAt)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Client ID</div>
              <div className="font-medium text-gray-900">{client.clientId}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldClientDetail;