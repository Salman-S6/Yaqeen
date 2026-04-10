<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceType\StoreServiceTypeRequest;
use App\Http\Requests\ServiceType\UpdateServiceTypeRequest;
use App\Http\Resources\ServiceTypeResource;
use App\Models\ServiceType;
use App\Services\ServiceTypeService;

class ServiceTypeController extends Controller
{
    protected ServiceTypeService $service;

    public function __construct(ServiceTypeService $service)
    {
        $this->service = $service;
        // $this->middleware('permission:view service types')->only(['index', 'show']);
        // $this->middleware('permission:create service types')->only('store');
        // $this->middleware('permission:edit service types')->only(['update']);
        // $this->middleware('permission:delete service types')->only('destroy');
    }

    public function index()
    {
        $types = $this->service->all();
        return ServiceTypeResource::collection($types);
    }

    public function show(ServiceType $serviceType)
    {
        return new ServiceTypeResource($serviceType);
    }

    public function store(StoreServiceTypeRequest $request)
    {
        $type = $this->service->create($request->validated());
        return new ServiceTypeResource($type);
    }

    public function update(UpdateServiceTypeRequest $request, ServiceType $serviceType)
    {
        $type = $this->service->update($serviceType, $request->validated());
        return new ServiceTypeResource($type);
    }

    public function destroy(ServiceType $serviceType)
    {
        $this->service->delete($serviceType);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
