<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RejectRequestRequest;
use App\Http\Requests\Request\StoreRequestRequest;
use App\Http\Resources\RequestResource;
use App\Services\RequestService;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    public function __construct(protected RequestService $service) {}

    public function index()
    {
        return RequestResource::collection(
            $this->service->getAll(Auth::user())
        );
    }

    public function store(StoreRequestRequest $request)
    {
        $result = $this->service->create(
            $request->validated(),
            Auth::user()
        );

        return new RequestResource($result);
    }

    public function show($id)
    {
        return new RequestResource(
            $this->service->findById($id, Auth::user())
        );
    }

    public function approve($id)
    {
        $result = $this->service->approve($id);

        return new RequestResource($result);
    }

    public function reject($id, RejectRequestRequest $request)
    {
        $result = $this->service->reject(
            $id,
            $request->validated('reason'),
            Auth::user()
        );

        return new RequestResource($result);
    }
}