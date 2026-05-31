<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Request\RejectRequestRequest;
use App\Http\Requests\Request\StoreRequestRequest;
use App\Http\Resources\RequestResource;
use App\Models\Request as RequestModel;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    public function __construct(protected RequestService $service) {}

    public function index(Request $request)
    {
        $user = $request->user();

        $requests = $this->service->getAll($user, $request->all());

        $stats = null;

        if ($user->hasRole('citizen') && $user->citizen) {
            $citizenId = $user->citizen->id;

            // $stats = [
            //     'total' => RequestModel::where('citizen_id', $citizenId)->count(),
            //     'pending' => RequestModel::where('citizen_id', $citizenId)->where('status', 'pending')->count(),
            //     'completed' => RequestModel::where('citizen_id', $citizenId)->whereIn('status', ['approved', 'rejected'])->count(),
            // ];

            $counts = RequestModel::where('citizen_id', $citizenId)
                ->selectRaw("COUNT(*) as total,
        SUM(status = 'pending') as pending,
        SUM(status IN ('approved','rejected')) as completed")
                ->first();

            $stats = [
                'total' => $counts->total,
                'pending' => $counts->pending,
                'completed' => $counts->completed,
            ];
        }

        return RequestResource::collection($requests)->additional([
            'status' => 'success',
            'stats' => $stats,
        ]);
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
