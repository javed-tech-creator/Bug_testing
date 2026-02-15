import 'package:dss_crm/marketing_module/marketing_manager/marketing_get_all_compaign_list_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/model/create_new_marketing_compaign_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/model/delete_marketing_compaign_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/model/update_marketing_campaign_model.dart';
import 'package:dss_crm/marketing_module/marketing_manager/model/update_marketing_compaign_status_model.dart';
import 'package:dss_crm/network_manager/repository.dart';
import 'package:flutter/material.dart';
import '../../../../network_manager/api_response.dart';
import '../../../../utils/custom_snack_bar.dart';

class MarketingManagerApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;

  bool get isLoading => _isLoading;

  ApiResponse<GetAllCompaignListModelResponse>? _getAllMarketingCompaignListModelResponse;
  ApiResponse<GetAllCompaignListModelResponse>? get getAllCompaignListModelResponse => _getAllMarketingCompaignListModelResponse;

  ApiResponse<CreateCampaignModelResponse>? _createNewMarketingCompaignListModelResponse;
  ApiResponse<CreateCampaignModelResponse>? get createNewMarketingCompaignListModelResponse => _createNewMarketingCompaignListModelResponse;

  ApiResponse<UpdateCampaignModelResponse>? _updateCampaignModelResponse;
  ApiResponse<UpdateCampaignModelResponse>? get updateCampaignModelResponse => _updateCampaignModelResponse;

  ApiResponse<UpdateCompaignStatusModelResponse>? _updateCompaignStatusModelResponse;
  ApiResponse<UpdateCompaignStatusModelResponse>? get updateCompaignStatusModelResponse => _updateCompaignStatusModelResponse;

  ApiResponse<DeleteCompaignModelResponse>? _deleteCampaignModelResponse;
  ApiResponse<DeleteCompaignModelResponse>? get deleteCampaignModelResponse => _deleteCampaignModelResponse;



  Future<void> getAllMarketingCompaignList(
    BuildContext context,
    int page,
    int limit,
  ) async {
    _isLoading = true;
    notifyListeners();

    try {
      final Map<String, dynamic> queryParameters = {
        'page': page,
        'limit': limit,
      };
      final response = await _repository.getAllMarketingCompaignList(
        queryParameters,
      );
      _getAllMarketingCompaignListModelResponse = response;
      if (!response.success) {
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Failed to load assets!',
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      _getAllMarketingCompaignListModelResponse = ApiResponse.error(
        "Something went wrong: $e",
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  Future<void> createNewCampaign(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.createNewCampaign(body);
      _createNewMarketingCompaignListModelResponse = response;

      if (response.success && response.data != null) {
        // final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Assets Added Successfully!";
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Access Control Added Successfully!";
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message,
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context);
      } else {
        debugPrint("Access Control Added failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Access Control Added failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Access Control Added Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }


  Future<void> updateCampaign(BuildContext context,Map<String, dynamic> body , String ticketId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateCampaign(ticketId , body);
      _updateCampaignModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Update Campaign Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        Navigator.pop(context, true);
      } else {
        debugPrint("Update Campaign failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Update Campaign failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Update Campaign Exception: $e");
    } finally {
      Navigator.pop(context, false);
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateCompaignStatusStatus(BuildContext context,Map<String, dynamic> body , String commpaignId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.updateMarketingCompaignStatus(commpaignId , body);
      _updateCompaignStatusModelResponse = response;

      if (response.success && response.data != null) {
        final apiMessage = response.data?.message;
        final message = (apiMessage != null && apiMessage.trim().isNotEmpty)
            ? apiMessage
            : "Status Updated Successfully!";

        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: message ?? "Asset Assigned Successfully",
          duration: const Duration(seconds: 2),
        );
        // Navigator.pop(context, true); // Pass true as result
      } else {
        debugPrint("Updated failed: ${response.message}");
        Navigator.pop(context, false);
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Updated failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Updated Exception: $e");
    } finally {
      Navigator.pop(context, false);
      _isLoading = false;
      notifyListeners();
    }
  }


  Future<void> deleteCampaign(BuildContext context, String campaignId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _repository.deleteCampaign(campaignId);
      _deleteCampaignModelResponse = response;

      if (!response.success) {
        debugPrint("Campaign Delete failed: ${response.message}");
      }
    } catch (e, stackTrace) {
      debugPrint("Campaign Delete Exception: $e");
      _deleteCampaignModelResponse = ApiResponse.error("Something went wrong: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }



}
