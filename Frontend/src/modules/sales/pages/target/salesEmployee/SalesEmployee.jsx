import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  Save
} from 'lucide-react';
import { TrendingUp, BarChart3, DollarSign } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import {
  useSaveTargetSlotMutation,
  useTargetByExecutiveIdQuery,
  useUpdateTargetSlotMutation,
  useSummaryDataQuery
} from '@/api/sales/target.api';
import Loader from '@/components/Loader';

const SalesEmployeeDashboard = () => {
  // Max limits
  const MAXS = {
    leadIn: 99999,
    salesIn: 9999,
    businessIn: 9999,
    amountIn: 9999
  };

  const QUARTER_MAP = {
    Q1: ['April', 'May', 'June'],
    Q2: ['July', 'August', 'September'],
    Q3: ['October', 'November', 'December'],
    Q4: ['January', 'February', 'March']
  };

  const [selectedPeriod, setSelectedPeriod] = useState({
    financialYear: '2024-25',
    quarter: 'Q1',
    month: 'April'
  });

  // Get user data from Redux
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};

  // Build query string for target fetch
  const query = `executiveId=${user?._id}&financialYear=${selectedPeriod?.financialYear}&quarter=${selectedPeriod?.quarter}&month=${selectedPeriod?.month}`;

  // Fetch target data
  const {
    data: targetData,
    isLoading: isTargetLoading,
    refetch: refetchTarget
  } = useTargetByExecutiveIdQuery({ query }, { skip: !user?._id });

  // Fetch summary data for table
  const [summaryFilter, setSummaryFilter] = useState('today');
  const summaryQuery = `executiveId=${user?._id}&financialYear=${selectedPeriod?.financialYear}&quarter=${selectedPeriod?.quarter}&month=${selectedPeriod?.month}&filter=${summaryFilter}`;

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary
  } = useSummaryDataQuery({ query: summaryQuery }, { skip: !user?._id });

  // Save slot mutation (for creating new slots)
  const [saveTargetSlot, { isLoading: isSaving }] = useSaveTargetSlotMutation();

  // Update slot mutation (for updating existing slots)
  const [updateTargetSlot, { isLoading: isUpdating }] = useUpdateTargetSlotMutation();

  // Use refs for form inputs to avoid focus loss
  const formRefs = useRef({
    slotTarget: null,
    leadIn: null,
    salesIn: null,
    businessIn: null,
    amountIn: null,
    meetingNotes: null,
    achievedAmount: null,
    carryForwardReason: null
  });

  const [currentSlotForm, setCurrentSlotForm] = useState({
    slot: 'S1',
    slotTarget: '',
    achievedAmount: '',
    meetingNotes: '',
    carryForwardReason: '',
    leadIn: '',
    salesIn: '',
    businessIn: '',
    amountIn: ''
  });

  const [expandedSections, setExpandedSections] = useState({
    slotDistribution: true,
    slotForm: true,
    progress: true
  });

  // Extract target data from API response
  const monthlyTarget = targetData?.data?.[0] || null;
  const slotTargets = monthlyTarget?.slotTargets || [];

  // Summary data from API
  const summary = summaryData?.data || {
    // Targets
    leadTargetCount: 100,
    leadTargetAmount: 50000,
    salesTargetCount: 50,
    salesTargetAmount: 250000,
    businessTargetCount: 30,
    businessTargetAmount: 750000,
    amountTarget: 1000000,
    
    // Achievements
    leadAchCount: 80,
    leadAchAmount: 40000,
    salesAchCount: 45,
    salesAchAmount: 225000,
    businessAchCount: 25,
    businessAchAmount: 625000,
    amountAch: 850000
  };

  const metrics = [
    {
      id: 'lead',
      name: 'Lead',
      icon: Target,
      color: 'bg-blue-100 text-blue-600',
      targetCount: summary.leadTargetCount || 0,
      targetAmount: summary.leadTargetAmount || 0,
      achCount: summary.leadAchCount || 0,
      achAmount: summary.leadAchAmount || 0
    },
    {
      id: 'sales',
      name: 'Sales',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      targetCount: summary.salesTargetCount || 0,
      targetAmount: summary.salesTargetAmount || 0,
      achCount: summary.salesAchCount || 0,
      achAmount: summary.salesAchAmount || 0
    },
    {
      id: 'business',
      name: 'Business',
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600',
      targetCount: summary.businessTargetCount || 0,
      targetAmount: summary.businessTargetAmount || 0,
      achCount: summary.businessAchCount || 0,
      achAmount: summary.businessAchAmount || 0
    },
    {
      id: 'amount',
      name: 'Amount',
      icon: DollarSign,
      color: 'bg-amber-100 text-amber-600',
      targetCount: '-', // Amount usually doesn't have count
      targetAmount: summary.amountTarget || 0,
      achCount: '-',
      achAmount: summary.amountAch || 0
    }
  ];

  // Helper functions
  const num = (v) => {
    if (v === '' || v === null || v === undefined) return 0;
    const n = Number(String(v).replace(/,/g, ''));
    return Number.isFinite(n) ? n : 0;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // const handleSlotFormChange = (field, value) => {
  //   console.log('Changing field:', field, 'to value:', value);
  //   const activeElement = document.activeElement;
  //   const activeElementId = activeElement?.id;
  //   console.log('Active element ID:', currentSlotForm);
  //   setCurrentSlotForm(prev => ({ ...prev, [field]: value }));
  //   console.log('Active element ID:', currentSlotForm);

  //   setTimeout(() => {
  //     if (activeElementId && document.getElementById(activeElementId)) {
  //       const element = document.getElementById(activeElementId);
  //       element.focus();
  //       const len = element.value.length;
  //       element.setSelectionRange(len, len);
  //     }
  //   }, 0);
  // };

  // Get slot data for current slot

  const handleSlotFormChange = (field, value) => {
    setCurrentSlotForm(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const getCurrentSlotData = () => {
    return slotTargets.find(slot => slot.slot === currentSlotForm.slot);
  };

  // Check if slot is archived (has any data)
  const isSlotArchived = (slotData) => {
    if (!slotData) return false;
    return slotData.achievedAmount > 0 
  };

  // Fetch existing slot data when slot changes
  useEffect(() => {
    const currentSlot = getCurrentSlotData();
    if (currentSlot) {
      setCurrentSlotForm(prev => ({
        ...prev,
        slotTarget: currentSlot.slotTarget?.toString() || '',
        achievedAmount: currentSlot.achievedAmount?.toString() || '',
        meetingNotes: currentSlot.meetingNotes || '',
        carryForwardReason: currentSlot.carryForwardReason || '',
        leadIn: currentSlot.leadIn?.toString() || '',
        salesIn: currentSlot.salesIn?.toString() || '',
        businessIn: currentSlot.businessIn?.toString() || '',
        amountIn: currentSlot.amountIn?.toString() || ''
      }));
    } else {
      setCurrentSlotForm(prev => ({
        ...prev,
        slotTarget: '',
        achievedAmount: '',
        meetingNotes: '',
        carryForwardReason: '',
        leadIn: '',
        salesIn: '',
        businessIn: '',
        amountIn: ''
      }));
    }
  }, [currentSlotForm.slot]);


  

  // Handle slot target distribution (Create/Update slot)
  const handleDistributeSlot = async () => {
    try {
      // Validation
      if (!QUARTER_MAP[selectedPeriod.quarter].includes(selectedPeriod.month)) {
       toast.error(`Please select a month that belongs to ${selectedPeriod.quarter}`);
        return;
      }

      const slotTargetNum = num(currentSlotForm.slotTarget);
      if (isNaN(slotTargetNum) || slotTargetNum <= 0) {
         toast.error('Enter a valid slot target amount');
        return;
      }

      // Validate other numeric fields
      const leadInN = num(currentSlotForm.leadIn);
      const salesInN = num(currentSlotForm.salesIn);
      const businessInN = num(currentSlotForm.businessIn);
      const amountInN = num(currentSlotForm.amountIn);

      if (leadInN > MAXS.leadIn) return  toast.error(`LeadIn max allowed is ${MAXS.leadIn}`);
      if (salesInN > MAXS.salesIn) return  toast.error(`SalesIn max allowed is ${MAXS.salesIn}`);
      if (businessInN > MAXS.businessIn) return  toast.error(`BusinessIn max allowed is ${MAXS.businessIn}`);
      if (amountInN > MAXS.amountIn) return  toast.error(`AmountIn max allowed is ${MAXS.amountIn}`);

      // Check if total slot targets exceed monthly target
      const otherSlotsTotal = slotTargets
        .filter(s => s.slot !== currentSlotForm.slot)
        .reduce((sum, s) => sum + num(s.slotTarget), 0);

      const totalWithNewSlot = otherSlotsTotal + slotTargetNum;
      if (totalWithNewSlot > num(monthlyTarget?.monthlyTarget)) {
         toast.error(`Total slot targets (₹${totalWithNewSlot}L) cannot exceed monthly target (₹${monthlyTarget?.monthlyTarget}L)`);
        return;
      }

      // Prepare API payload
      const slotData = {
        monthlyTargetId: monthlyTarget?._id,
        executiveId: user?._id,
        financialYear: selectedPeriod.financialYear,
        quarter: selectedPeriod.quarter,
        month: selectedPeriod.month,
        slot: currentSlotForm.slot,
        slotTarget: slotTargetNum,
        achievedAmount: 0,
        leadIn: leadInN,
        salesIn: salesInN,
        businessIn: businessInN,
        amountIn: amountInN,
        meetingNotes: currentSlotForm.meetingNotes,
        carryForwardReason: '',
        slotStartDate: new Date().toISOString(),
        slotEndDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString() // 10 days later
      };

      // Call API
      const response = await saveTargetSlot({ formData: slotData }).unwrap();

      if (response.success) {
         toast.success('Slot target set successfully!');
        // Refetch target data and summary
        refetchTarget();
        refetchSummary();
        // Reset form
        setCurrentSlotForm(prev => ({
          ...prev,
          slotTarget: '',
          leadIn: '',
          salesIn: '',
          businessIn: '',
          amountIn: '',
          meetingNotes: ''
        }));
      } else {
         toast.error(response.message || 'Failed to save slot');
      }
    } catch (error) {
      console.error('Error saving slot:', error);
       toast.error(error?.data?.message || 'Failed to save slot');
    }
  };

  // Handle slot achievement submission (UPDATE existing slot)
  const handleSubmitSlot = async () => {
    try {
      const currentSlot = getCurrentSlotData();
      if (!currentSlot) {
         toast.error('Please set slot target first');
        return;
      }

      const achievedAmount = num(currentSlotForm.achievedAmount);
      const slotTarget = num(currentSlot.slotTarget);

      if (achievedAmount > slotTarget) {
         toast.error('Achieved amount cannot be greater than slot target');
        return;
      }

      // Validate numeric fields
      const leadInN = num(currentSlotForm.leadIn);
      const salesInN = num(currentSlotForm.salesIn);
      const businessInN = num(currentSlotForm.businessIn);
      const amountInN = num(currentSlotForm.amountIn);

      if (leadInN > MAXS.leadIn) return  toast.error(`LeadIn max allowed is ${MAXS.leadIn}`);
      if (salesInN > MAXS.salesIn) return  toast.error(`SalesIn max allowed is ${MAXS.salesIn}`);
      if (businessInN > MAXS.businessIn) return  toast.error(`BusinessIn max allowed is ${MAXS.businessIn}`);
      if (amountInN > MAXS.amountIn) return  toast.error(`AmountIn max allowed is ${MAXS.amountIn}`);

      // Check for carry forward reason if achievement is less than target
      if (achievedAmount < slotTarget && !currentSlotForm.carryForwardReason.trim()) {
         toast.error('Please provide carry forward reason as achieved amount is less than target');
        return;
      }

      // Prepare update payload for UPDATE API
      const updateData = {
        slotId: currentSlot._id,
        achievedAmount: achievedAmount,
        leadIn: leadInN,
        salesIn: salesInN,
        businessIn: businessInN,
        amountIn: amountInN,
        meetingNotes: currentSlotForm.meetingNotes,
        carryForwardReason: currentSlotForm.carryForwardReason,
        submittedAt: new Date().toISOString()
      };

      // Call UPDATE API (not save API)
      const response = await updateTargetSlot({slotId: currentSlot._id,formData:updateData}).unwrap();

      if (response.success) {
         toast.success('Slot achievement submitted successfully!');
        // Refetch data
        refetchTarget();
        refetchSummary();
        // Reset form
        setCurrentSlotForm({
          slot: 'S1',
          slotTarget: '',
          achievedAmount: '',
          meetingNotes: '',
          carryForwardReason: '',
          leadIn: '',
          salesIn: '',
          businessIn: '',
          amountIn: ''
        });
      } else {
         toast.error(response.message || 'Failed to submit achievement');
      }
    } catch (error) {
      console.error('Error submitting achievement:', error);
       toast.error(error?.data?.message || 'Failed to submit achievement');
    }
  };

  // Calculate totals
  const getTotalSlotTargets = () => {
    return slotTargets.reduce((sum, s) => sum + num(s.slotTarget), 0);
  };

  const getTotalAchieved = () => {
    return slotTargets.reduce((sum, s) => sum + num(s.achievedAmount), 0);
  };

  const getMonthlyProgress = () => {
    if (!monthlyTarget?.monthlyTarget) return 0;
    const totalAchieved = getTotalAchieved();
    return (totalAchieved / num(monthlyTarget.monthlyTarget)) * 100;
  };

  // Refetch summary when filter or period changes
  useEffect(() => {
    if (user?._id) {
      refetchSummary();
    }
  }, [summaryFilter, selectedPeriod, user?._id]);

  // Loading state
  if (isTargetLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <Loader/>
      </div>
    );
  }

  // If no target data
  if (!monthlyTarget) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Sales Target Dashboard" />
        {/* Period Selection */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-700" /> Select Period
            </h3>
            <div className="text-sm text-gray-600">India FY quarters</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <select
              className="p-2 border rounded-lg text-sm"
              value={selectedPeriod.financialYear}
              onChange={(e) => setSelectedPeriod(prev => ({ ...prev, financialYear: e.target.value }))}
            >
              {['2024-25', '2025-26', '2026-27'].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              className="p-2 border rounded-lg text-sm"
              value={selectedPeriod.quarter}
              onChange={(e) => {
                const newQ = e.target.value;
                setSelectedPeriod(prev => ({
                  ...prev,
                  quarter: newQ,
                  month: QUARTER_MAP[newQ][0]
                }));
              }}
            >
              {Object.keys(QUARTER_MAP).map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>

            <select
              className="p-2 border rounded-lg text-sm"
              value={selectedPeriod.month}
              onChange={(e) => setSelectedPeriod(prev => ({ ...prev, month: e.target.value }))}
            >
              {QUARTER_MAP[selectedPeriod.quarter].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 p-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Target Assigned</h3>
            <p className="text-gray-600">
              You don't have any target assigned for {selectedPeriod.month} {selectedPeriod.quarter} {selectedPeriod.financialYear}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  const TargetsTab = () => {
    const totalSlotTargets = getTotalSlotTargets();
    const totalAchieved = getTotalAchieved();
    const monthlyProgress = getMonthlyProgress();
    const currentSlot = getCurrentSlotData();
    const isCurrentSlotArchived = isSlotArchived(currentSlot);

    return (
      <div className="space-y-5">
        {/* Period Selection */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-700" /> Select Period
            </h3>
            <div className="text-sm text-gray-600">India FY quarters</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <select
              className="p-2 border rounded-sm text-sm"
              value={selectedPeriod.financialYear}
              onChange={(e) => setSelectedPeriod(prev => ({ ...prev, financialYear: e.target.value }))}
            >
              {['2024-25', '2025-26', '2026-27'].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              className="p-2 border rounded-sm text-sm"
              value={selectedPeriod.quarter}
              onChange={(e) => {
                const newQ = e.target.value;
                setSelectedPeriod(prev => ({
                  ...prev,
                  quarter: newQ,
                  month: QUARTER_MAP[newQ][0]
                }));
              }}
            >
              {Object.keys(QUARTER_MAP).map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>

            <select
              className="p-2 border rounded-sm text-sm"
              value={selectedPeriod.month}
              onChange={(e) => setSelectedPeriod(prev => ({ ...prev, month: e.target.value }))}
            >
              {QUARTER_MAP[selectedPeriod.quarter].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Monthly Target</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              ₹{num(monthlyTarget.monthlyTarget)}L
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Set by: {monthlyTarget.managerId?.name || 'Team Lead'}
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Total Achieved</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              ₹{totalAchieved.toFixed(1)}L
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {monthlyProgress.toFixed(1)}% of target
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Remaining</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              ₹{Math.max(num(monthlyTarget.monthlyTarget) - totalAchieved, 0).toFixed(1)}L
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Balance to achieve
            </div>
          </div>
        </div>

        {/* Slot Distribution Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div
            className="p-4 border-b bg-gray-50 rounded-t-lg cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('slotDistribution')}
          >
            <h3 className="text-md font-medium text-gray-900 flex items-center">
              <Target className="h-4 w-4 mr-2 text-gray-600" /> Slot Amount Distribution
            </h3>
            {expandedSections.slotDistribution ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>

          {expandedSections.slotDistribution && (
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Slot</label>
                  <select
                    className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                    value={currentSlotForm.slot}
                    onChange={(e) => handleSlotFormChange('slot', e.target.value)}
                  >
                    {['S1', 'S2', 'S3'].map(s => (
                      <option key={s} value={s}>
                        {s} ({s === 'S1' ? '1-10' : s === 'S2' ? '11-20' : '21-End'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slot Target (₹ Lacs)</label>
                  <input
                    id="slotTargetInput"
                    type="number"
                    step="0.1"
                    className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                    placeholder="Enter target amount"
                    value={currentSlotForm.slotTarget}
                    onChange={(e) => handleSlotFormChange('slotTarget', e.target.value)}
                    disabled={!!currentSlot} // Disable if slot already exists
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleDistributeSlot}
                    disabled={isSaving || !!currentSlot}
                    className={`px-4 py-2 rounded-sm text-sm flex items-center w-full justify-center ${isSaving || currentSlot
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-900'
                      }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        {currentSlot ? 'Slot Already Set' : 'Set Slot Target'}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Additional fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead In</label>
                  <input
                    id="leadInInput"
                    type="number"
                    className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                    placeholder="Lead In"
                    value={currentSlotForm.leadIn}
                    onChange={(e) => handleSlotFormChange('leadIn', e.target.value)}
                    disabled={isCurrentSlotArchived}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sales In</label>
                  <input
                    id="salesInInput"
                    type="number"
                    className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                    placeholder="Sales In"
                    value={currentSlotForm.salesIn}
                    onChange={(e) => handleSlotFormChange('salesIn', e.target.value)}
                    disabled={isCurrentSlotArchived}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business In</label>
                  <input
                    id="businessInInput"
                    type="number"
                    className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                    placeholder="Business In"
                    value={currentSlotForm.businessIn}
                    onChange={(e) => handleSlotFormChange('businessIn', e.target.value)}
                    disabled={isCurrentSlotArchived}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount In (₹ Lacs)</label>
                  <input
                    id="amountInInput"
                    type="number"
                    step="0.1"
                    className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                    placeholder="Amount In"
                    value={currentSlotForm.amountIn}
                    onChange={(e) => handleSlotFormChange('amountIn', e.target.value)}
                    disabled={isCurrentSlotArchived}
                  />
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Slot Achievement Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div
            className="p-4 border-b bg-gray-50 rounded-t-lg cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('slotForm')}
          >
            <h3 className="text-md font-medium text-gray-900 flex items-center">
              <Save className="h-4 w-4 mr-2 text-gray-600" /> Slot Achievement Entry
            </h3>
            {expandedSections.slotForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>

          {expandedSections.slotForm && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Slot</label>
                  <select
                    className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                    value={currentSlotForm.slot}
                    onChange={(e) => handleSlotFormChange('slot', e.target.value)}
                  >
                    {['S1', 'S2', 'S3'].map(s => (
                      <option key={s} value={s}>
                        {s} ({s === 'S1' ? '1-10' : s === 'S2' ? '11-20' : '21-End'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₹ Lacs)</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 text-sm bg-gray-100 rounded-sm"
                    value={currentSlot?.slotTarget || '0'}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achieved Amount (₹ Lacs)</label>
                  <input
                    id="achievedAmountInput"
                    type="number"
                    step="0.1"
                    className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                    placeholder="Enter achieved amount"
                    value={currentSlotForm.achievedAmount}
                    onChange={(e) => handleSlotFormChange('achievedAmount', e.target.value)}
                    disabled={isCurrentSlotArchived}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Notes</label>
                <textarea
                  id="achievementMeetingNotes"
                  rows="2"
                  className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                  placeholder="Meeting notes..."
                  value={currentSlotForm.meetingNotes}
                  onChange={(e) => handleSlotFormChange('meetingNotes', e.target.value)}
                />
              </div>

              {num(currentSlotForm.achievedAmount) < num(currentSlot?.slotTarget || 0) && !isCurrentSlotArchived && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carry Forward Reason *</label>
                  <textarea
                    id="carryForwardReason"
                    rows="2"
                    className="w-full p-2 border border-gray-300 text-sm rounded-sm"
                    placeholder="Reason for not achieving target..."
                    value={currentSlotForm.carryForwardReason}
                    onChange={(e) => handleSlotFormChange('carryForwardReason', e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSubmitSlot}
                  disabled={isUpdating || !currentSlot || isCurrentSlotArchived}
                  className={`px-4 py-2 rounded-sm text-sm flex items-center ${isUpdating || !currentSlot || isCurrentSlotArchived
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-900'
                    }`}
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> {isCurrentSlotArchived ? 'Slot Archived' : 'Update Achievement'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setCurrentSlotForm({
                      slot: 'S1',
                      slotTarget: '',
                      achievedAmount: '',
                      meetingNotes: '',
                      carryForwardReason: '',
                      leadIn: '',
                      salesIn: '',
                      businessIn: '',
                      amountIn: ''
                    });
                  }}
                  className="px-4 py-2 rounded-sm text-sm border text-gray-700 hover:bg-gray-50"
                  disabled={isCurrentSlotArchived}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Slots Summary */}
        {slotTargets.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-md font-medium text-gray-900">Existing Slots</h3>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Slot</th>
                      <th className="p-2 text-left">Target (₹L)</th>
                      <th className="p-2 text-left">Achieved (₹L)</th>
                      <th className="p-2 text-left">Progress</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slotTargets.map((slot) => {
                      const progress = num(slot.slotTarget) > 0
                        ? (num(slot.achievedAmount) / num(slot.slotTarget)) * 100
                        : 0;
                      const archived = isSlotArchived(slot);
                      return (
                        <tr key={slot._id} className={`border-b hover:bg-gray-50 ${archived ? 'bg-gray-50' : ''}`}>
                          <td className="p-2">
                            {slot.slot}
                            {archived && <span className="ml-2 text-xs text-gray-500">(Archived)</span>}
                          </td>
                          <td className="p-2">₹{num(slot.slotTarget)}L</td>
                          <td className="p-2">₹{num(slot.achievedAmount)}L</td>
                          <td className="p-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{progress.toFixed(1)}%</span>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${slot.approval?.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : slot.approval?.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {slot.approval?.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Target vs Achievement Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Target vs Achievement</h2>
          <p className="text-sm text-gray-600">Detailed breakdown with counts and amounts</p>
        </div>
        
        <div className="flex gap-2">
          {['today', 'month', 'quarter'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSummaryFilter(filter)}
              className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
                summaryFilter === filter
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Metric</th>
              
              {/* Target Column */}
              <th colSpan="2" className="text-center py-3 px-4 text-sm font-semibold text-gray-600 bg-gray-50">
                <div className="flex flex-col items-center">
                  <span className="font-bold">Target</span>
                  <span className="text-xs text-gray-500">(Count & Amount)</span>
                </div>
              </th>
              
              {/* Achievement Column */}
              <th colSpan="2" className="text-center py-3 px-4 text-sm font-semibold text-gray-600 bg-blue-50">
                <div className="flex flex-col items-center">
                  <span className="font-bold">Achievement</span>
                  <span className="text-xs text-blue-500">(Count & Amount)</span>
                </div>
              </th>
            </tr>
            
            {/* Sub-headers */}
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-2 px-4 text-xs text-gray-500 font-medium"></th>
              <th className="py-2 px-4 text-xs text-gray-500 font-medium text-center">Count</th>
              <th className="py-2 px-4 text-xs text-gray-500 font-medium text-center">Amount (₹)</th>
              <th className="py-2 px-4 text-xs text-gray-500 font-medium text-center">Count</th>
              <th className="py-2 px-4 text-xs text-gray-500 font-medium text-center">Amount (₹)</th>
            </tr>
          </thead>
          
          <tbody>
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <tr key={metric.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {/* Metric Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${metric.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{metric.name}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Target Count */}
                  <td className="py-4 px-4 text-center">
                    <div className="font-semibold text-gray-800">
                      {typeof metric.targetCount === 'number' 
                        ? metric.targetCount.toLocaleString() 
                        : metric.targetCount}
                    </div>
                  </td>
                  
                  {/* Target Amount */}
                  <td className="py-4 px-4 text-center">
                    <div className="font-semibold text-gray-800">
                      ₹{metric.targetAmount.toLocaleString()}
                    </div>
                  </td>
                  
                  {/* Achievement Count */}
                  <td className="py-4 px-4 text-center">
                    <div className="font-semibold text-gray-800">
                      {typeof metric.achCount === 'number' 
                        ? metric.achCount.toLocaleString() 
                        : metric.achCount}
                    </div>
                  </td>
                  
                  {/* Achievement Amount */}
                  <td className="py-4 px-4 text-center">
                    <div className="font-semibold text-gray-800">
                      ₹{metric.achAmount.toLocaleString()}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Sales Target Dashboard" />
      <div className="max-w-7xl mx-auto ">
        <TargetsTab />
      </div>
    </div>
  );
};

export default SalesEmployeeDashboard;